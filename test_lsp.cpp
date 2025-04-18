#include <iostream>
#include <vector>
#include <string>
#include <memory>
#include <algorithm>

class User {
public:
    int id;
    std::string name;

    User(int id, std::string name)
        : id(id), name(std::move(name)) {}

    void greet(const std::string& prefix) {
        std::cout << prefix << ", " << name << std::endl;
    }

    static User make(int id, std::string name) {
        return User{id, std::move(name)};
    }
};

enum class Mode {
    FAST,
    SLOW
};

template <typename T>
class Wrapper {
public:
    T value;
    void print() const {
        std::cout << value << std::endl;
    }
};

class Config {
public:
    int flags = 42;
};

Config get_config() {
    return Config{};
}

User get_current_user() {
    return User::make(7, "TestUser");
}

void log_user(User u) {
    std::cout << "Logging: " << u.name << std::endl;
}

void callback_handler(int value) {
    std::cout << "Callback: " << value << std::endl;
}

using cb_t = void(*)(int);

cb_t get_callback() {
    return callback_handler;
}

int compute() {
    return 5;
}

int compute_score(const User& user) {
    return user.id * 10;
}

int main() {
    // Case 1: member call
    User u = User::make(1, "Alice");
    u.greet("Hello");

    // Case 2: scoped identifier
    std::cout << std::endl;

    // Case 3: new expression
    User* ptr = new User(2, "Bob");
    ptr->greet("Hi");
    delete ptr;

    // Case 4: template type field access
    Wrapper<std::string> wrap;
    wrap.value = "wrapped!";
    wrap.print();
    std::cout << wrap.value.size() << std::endl;

    // Case 5: auto type inference
    auto result = compute_score(u);
    std::cout << result << std::endl;

    // Case 6: unique_ptr dereference
    std::unique_ptr<User> smart_user = std::make_unique<User>(3, "Carol");
    smart_user->greet("Welcome");

    // Case 7: lambda call
    auto adder = [](int a, int b) { return a + b; };
    int sum = adder(1, 2);
    std::cout << "Sum: " << sum << std::endl;

    // Case 8: cast expression
    Mode mode = static_cast<Mode>(0);

    // Case 9: enum comparison
    if (mode == Mode::FAST) {
        std::cout << "Fast mode enabled" << std::endl;
    }

    // Case 10: STL + iterator dereference
    std::vector<int> vec = {1, 2, 3};
    auto it = std::find(vec.begin(), vec.end(), 2);
    if (it != vec.end()) {
        std::cout << "Found: " << *it << std::endl;
    }

    return 0;
}
