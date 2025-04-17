#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    int x;
    float y;
} Point;

typedef struct {
    int id;
    const char* name;
} User;

enum Mode { FAST, SLOW };

typedef void (*cb_t)(int);

typedef struct {
    int flags;
} Config;

Config get_config();                          // ⬅ case 8
User get_current_user();                      // ⬅ case 7
void log_user(User u);
void callback_handler(int value) { }
cb_t get_callback() { return callback_handler; }

int compute();                                // ⬅ case 4

int add(int a, int b) {
    return a + b;
}

int main() {
    // ✅ Case 1: Function Call Completion
    int result = add(|);                      // ⬅ case 1
    // 💡 Prediction: add(10, 20)
    // 🔍 Node: call_expression → `executeDefinitionProvider`

    // ✅ Case 2: Struct Field Access Completion
    Point pt = { .x = 5, .y = 3.14 };
    pt.|;                                     // ⬅ case 2
    // 💡 Prediction: x, y
    // 🔍 Node: field_expression → `executeTypeDefinitionProvider` on `pt`

    // ✅ Case 3: Variable Declarator Type Completion
    FILE* fp = fopen("file.txt", "r");        // ⬅ case 3 (cursor on `fp|`)
    // 💡 Prediction: Suggest fread(fp, ...), fclose(fp)
    // 🔍 Node: variable_declarator → `executeTypeDefinitionProvider` on `fp`

    // ✅ Case 4: Identifier Symbol Resolution
    int val = compute(|);                     // ⬅ case 4
    // 💡 Prediction: compute() has no args OR suggest args based on signature
    // 🔍 Node: identifier/call_expression → `executeDefinitionProvider`

    // ✅ Case 5: Type Identifier
    Point| p2;                                // ⬅ case 5 (cursor on `Point`)
    // 💡 Prediction: Suggest fields of Point if p2. is typed later
    // 🔍 Node: type_identifier → `executeDefinitionProvider`

    // ✅ Case 6: Array Element Access + Field Suggestion
    Point points[3] = {{1, 1.0}, {2, 2.0}, {3, 3.0}};
    points[0].|;                              // ⬅ case 6
    // 💡 Prediction: x, y
    // 🔍 Node: field_expression → `executeTypeDefinitionProvider` on `points`

    // ✅ Case 7: Assignment Expression → RHS Type Inference
    User u = get_current_user(|);            // ⬅ case 7
    // 💡 Prediction: Suggest u.id, u.name later
    // 🔍 Node: call_expression → `executeDefinitionProvider` on `get_current_user`

    // ✅ Case 8: Return Statement Type Inference
    return get_config(|);                    // ⬅ case 8
    // 💡 Prediction: Suggest config.flags or similar usage after
    // 🔍 Node: call_expression → `executeDefinitionProvider` on `get_config`

    // ✅ Case 9: Enum Constant Suggestion
    enum Mode mode = |;                      // ⬅ case 9
    // 💡 Prediction: FAST, SLOW
    // 🔍 Node: assignment_expression → `executeTypeDefinitionProvider` on `mode`

    // ✅ Case 10: Function Pointer Call
    cb_t cb = get_callback();
    cb(|);                                   // ⬅ case 10
    // 💡 Prediction: cb(123)
    // 🔍 Node: call_expression → `executeTypeDefinitionProvider` on `cb`

    // ✅ Case 11: Enum Comparison Suggestion
    if (mode == |) {                         // ⬅ case 11
        printf("FAST mode\n");
    }
    // 💡 Prediction: FAST, SLOW
    // 🔍 Node: binary_expression → `executeTypeDefinitionProvider` on `mode`

    return 0;
}
