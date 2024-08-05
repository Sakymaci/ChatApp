#include <map>
#include <iostream>
#include <cassert>

template<typename K, typename V>
class interval_map {
    friend void IntervalMapTest();
    V m_valBegin;
    std::map<K, V> m_map;

public:
    // constructor associates whole range of K with val
    interval_map(V const& val)
        : m_valBegin(val)
    {}

    // Assign value val to interval [keyBegin, keyEnd).
    // Overwrite previous values in this interval.
    // Conforming to the C++ Standard Library conventions, the interval
    // includes keyBegin, but excludes keyEnd.
    // If !(keyBegin < keyEnd), this designates an empty interval,
    // and assign must do nothing.
    void assign(K const& keyBegin, K const& keyEnd, V const& val) {
        if (!(keyBegin < keyEnd)) return;

        auto itBegin = m_map.lower_bound(keyBegin);
        auto itEnd = m_map.lower_bound(keyEnd);

        // Determine the values before and after the interval
        V valBefore = (itBegin == m_map.begin()) ? m_valBegin : std::prev(itBegin)->second;
        V valAfter = (itEnd == m_map.begin()) ? m_valBegin : std::prev(itEnd)->second;

        // Remove all affected intervals within the range
        m_map.erase(itBegin, itEnd);

        // Insert the new interval if it differs from the previous value
        if (valBefore != val) {
            m_map.emplace(keyBegin, val);
        }

        // Restore the value after the interval if it differs from the new value
        if (valAfter != val) {
            m_map.emplace(keyEnd, valAfter);
        }

        // Clean up redundant entries to maintain canonicity
        auto cleanUp = [this](auto it) {
            if (it != m_map.begin()) {
                auto prev = std::prev(it);
                if (prev != m_map.end() && prev->second == it->second) {
                    m_map.erase(it);
                }
            }
        };

        cleanUp(m_map.find(keyBegin));
        cleanUp(m_map.find(keyEnd));
    }

    // look-up of the value associated with key
    V const& operator[](K const& key) const {
        auto it = m_map.upper_bound(key);
        if (it == m_map.begin()) {
            return m_valBegin;
        } else {
            return std::prev(it)->second;
        }
    }
};

// Test the interval_map class
void IntervalMapTest() {
    interval_map<int, char> map('A');

    // Test case 1: Assign 'B' to interval [1, 3)
    map.assign(1, 3, 'B');
    assert(map[-1] == 'A');
    assert(map[0] == 'A');
    assert(map[1] == 'B');
    assert(map[2] == 'B');
    assert(map[3] == 'A');
    assert(map[4] == 'A');

    // Test case 2: Assign 'C' to interval [2, 5)
    map.assign(2, 5, 'C');
    assert(map[1] == 'B');
    assert(map[2] == 'C');
    assert(map[3] == 'C');
    assert(map[4] == 'C');
    assert(map[5] == 'A');

    // Test case 3: Assign 'A' to interval [1, 2) (should revert it to the initial state)
    map.assign(1, 2, 'A');
    assert(map[1] == 'A');
    assert(map[2] == 'C');
    assert(map[5] == 'A');

    // Test case 4: Assign 'D' to interval [4, 7)
    map.assign(4, 7, 'D');
    assert(map[3] == 'C');
    assert(map[4] == 'D');
    assert(map[5] == 'D');
    assert(map[6] == 'D');
    assert(map[7] == 'A');

    // Test case 5: Assign 'E' to interval [0, 2)
    map.assign(0, 2, 'E');
    assert(map[-1] == 'A');
    assert(map[0] == 'E');
    assert(map[1] == 'E');
    assert(map[2] == 'C');
    assert(map[7] == 'A');

    std::cout << "All tests passed!" << std::endl;
}

int main() {
    IntervalMapTest();
    return 0;
}
