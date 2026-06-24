#include <emscripten.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <time.h>

#define GRID_SIZE 20
#define MAX_SNAKE_LENGTH 400
#define FOOD_NORMAL 0
#define FOOD_BONUS 1
#define FOOD_SPEED 2

// 游戏状态
typedef struct {
    int x, y;
} Point;

typedef struct {
    Point snake[MAX_SNAKE_LENGTH];
    int snake_length;
    Point food;
    int food_type;  // 0=normal, 1=bonus(+3), 2=speed
    int direction;  // 0=up, 1=right, 2=down, 3=left
    int score;
    int game_over;
    int wall_pass;  // 穿墙模式
    int speed_boost; // 加速剩余步数
} GameState;

static GameState game;
static char json_buffer[16384];

// 方向偏移: up, right, down, left
const int dx[] = {0, 1, 0, -1};
const int dy[] = {-1, 0, 1, 0};

// 生成随机位置（不在蛇身上）
Point random_food_position() {
    Point pos;
    int valid;
    int attempts = 0;
    do {
        valid = 1;
        pos.x = rand() % GRID_SIZE;
        pos.y = rand() % GRID_SIZE;
        for (int i = 0; i < game.snake_length; i++) {
            if (game.snake[i].x == pos.x && game.snake[i].y == pos.y) {
                valid = 0;
                break;
            }
        }
        attempts++;
    } while (!valid && attempts < 1000);

    // 随机尝试失败后，遍历整个棋盘找一个空位
    if (!valid) {
        for (int y = 0; y < GRID_SIZE; y++) {
            for (int x = 0; x < GRID_SIZE; x++) {
                valid = 1;
                for (int i = 0; i < game.snake_length; i++) {
                    if (game.snake[i].x == x && game.snake[i].y == y) {
                        valid = 0;
                        break;
                    }
                }
                if (valid) {
                    pos.x = x;
                    pos.y = y;
                    return pos;
                }
            }
        }
    }
    return pos;
}

// 生成食物
void spawn_food() {
    game.food = random_food_position();
    
    // 随机食物类型
    int r = rand() % 100;
    if (r < 10) {
        game.food_type = FOOD_BONUS;  // 10% 概率加分食物
    } else if (r < 18) {
        game.food_type = FOOD_SPEED;  // 8% 概率加速食物
    } else {
        game.food_type = FOOD_NORMAL; // 82% 普通食物
    }
}

// 初始化游戏
EMSCRIPTEN_KEEPALIVE
void init_game() {
    srand(time(NULL));
    
    game.snake_length = 3;
    game.snake[0] = (Point){GRID_SIZE / 2, GRID_SIZE / 2};
    game.snake[1] = (Point){GRID_SIZE / 2 - 1, GRID_SIZE / 2};
    game.snake[2] = (Point){GRID_SIZE / 2 - 2, GRID_SIZE / 2};
    
    game.direction = 1; // 向右
    game.score = 0;
    game.game_over = 0;
    game.wall_pass = 0;
    game.speed_boost = 0;
    
    spawn_food();
}

// 游戏循环
EMSCRIPTEN_KEEPALIVE
void game_loop() {
    if (game.game_over) return;
    
    // 计算新头部位置
    Point new_head;
    new_head.x = game.snake[0].x + dx[game.direction];
    new_head.y = game.snake[0].y + dy[game.direction];
    
    // 穿墙模式处理
    if (game.wall_pass) {
        if (new_head.x < 0) new_head.x = GRID_SIZE - 1;
        if (new_head.x >= GRID_SIZE) new_head.x = 0;
        if (new_head.y < 0) new_head.y = GRID_SIZE - 1;
        if (new_head.y >= GRID_SIZE) new_head.y = 0;
    } else {
        // 墙壁碰撞检测
        if (new_head.x < 0 || new_head.x >= GRID_SIZE || 
            new_head.y < 0 || new_head.y >= GRID_SIZE) {
            game.game_over = 1;
            return;
        }
    }
    
    // 自身碰撞检测
    for (int i = 0; i < game.snake_length; i++) {
        if (game.snake[i].x == new_head.x && game.snake[i].y == new_head.y) {
            game.game_over = 1;
            return;
        }
    }
    
    // 检查是否吃到食物
    int ate_food = (new_head.x == game.food.x && new_head.y == game.food.y);
    
    // 移动蛇
    if (ate_food) {
        // 增加长度
        for (int i = game.snake_length; i > 0; i--) {
            game.snake[i] = game.snake[i - 1];
        }
        game.snake_length++;
        
        // 根据食物类型增加分数
        switch (game.food_type) {
            case FOOD_BONUS:
                game.score += 30;
                break;
            case FOOD_SPEED:
                game.score += 10;
                game.speed_boost = 20; // 加速20步
                break;
            default:
                game.score += 10;
                break;
        }
        
        spawn_food();
    } else {
        // 移动身体
        for (int i = game.snake_length - 1; i > 0; i--) {
            game.snake[i] = game.snake[i - 1];
        }
    }
    
    // 更新头部
    game.snake[0] = new_head;
    
    // 减少加速步数
    if (game.speed_boost > 0) {
        game.speed_boost--;
    }
}

// 处理按键
EMSCRIPTEN_KEEPALIVE
void handle_key(int key) {
    switch (key) {
        case 'W':
        case 'w':
            if (game.direction != 2) game.direction = 0; // 不允许直接掉头
            break;
        case 'S':
        case 's':
            if (game.direction != 0) game.direction = 2;
            break;
        case 'A':
        case 'a':
            if (game.direction != 1) game.direction = 3;
            break;
        case 'D':
        case 'd':
            if (game.direction != 3) game.direction = 1;
            break;
    }
}

// 获取游戏状态（JSON 格式）
EMSCRIPTEN_KEEPALIVE
const char* get_game_state() {
    char* p = json_buffer;
    p += sprintf(p, "{\"game_over\":%s,\"score\":%d,\"snake\":[", 
                 game.game_over ? "true" : "false", game.score);
    
    for (int i = 0; i < game.snake_length; i++) {
        if (i > 0) p += sprintf(p, ",");
        p += sprintf(p, "{\"x\":%d,\"y\":%d}", game.snake[i].x, game.snake[i].y);
    }
    
    p += sprintf(p, "],\"food\":{\"x\":%d,\"y\":%d,\"type\":\"", game.food.x, game.food.y);
    
    switch (game.food_type) {
        case FOOD_BONUS:
            p += sprintf(p, "bonus");
            break;
        case FOOD_SPEED:
            p += sprintf(p, "speed");
            break;
        default:
            p += sprintf(p, "normal");
            break;
    }
    
    p += sprintf(p, "\"},\"wall_pass\":%s,\"speed_boost\":%d}", 
                 game.wall_pass ? "true" : "false", game.speed_boost);
    
    return json_buffer;
}

// 设置穿墙模式
EMSCRIPTEN_KEEPALIVE
void set_wall_pass(int enabled) {
    game.wall_pass = enabled;
}
