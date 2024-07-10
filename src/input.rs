use std::collections::{HashMap, HashSet};

// The input in the format:
//
// ```
// <package1> => [dep1, dep2, ...]
// <package2> => [dep2, dep3, ...]
// ...
// ```
pub type Input = HashMap<String, HashSet<String>>;
