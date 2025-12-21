Here's a comprehensive list of MongoDB operators categorized by their use:

## **QUERY OPERATORS**

### **Comparison Operators**

| Operator | Description | Example |
|----------|-------------|---------|
| **`$eq`** | Equal to | `{ age: { $eq: 25 } }` |
| **`$ne`** | Not equal to | `{ status: { $ne: "inactive" } }` |
| **`$gt`** | Greater than | `{ age: { $gt: 18 } }` |
| **`$gte`** | Greater than or equal | `{ score: { $gte: 60 } }` |
| **`$lt`** | Less than | `{ age: { $lt: 65 } }` |
| **`$lte`** | Less than or equal | `{ price: { $lte: 100 } }` |
| **`$in`** | Matches any value in array | `{ status: { $in: ["active", "pending"] } }` |
| **`$nin`** | Not in array | `{ role: { $nin: ["admin", "superadmin"] } }` |

### **Logical Operators**

| Operator | Description | Example |
|----------|-------------|---------|
| **`$and`** | Logical AND | `{ $and: [{ age: { $gt: 18 } }, { age: { $lt: 65 } }] }` |
| **`$or`** | Logical OR | `{ $or: [{ status: "active" }, { isPremium: true }] }` |
| **`$not`** | Logical NOT | `{ age: { $not: { $lt: 18 } } }` |
| **`$nor`** | Logical NOR | `{ $nor: [{ status: "active" }, { isDeleted: true }] }` |

### **Element Operators**

| Operator | Description | Example |
|----------|-------------|---------|
| **`$exists`** | Field exists | `{ phone: { $exists: true } }` |
| **`$type`** | Field type matches | `{ age: { $type: "int" } }` |

### **Evaluation Operators**

| Operator | Description | Example |
|----------|-------------|---------|
| **`$expr`** | Allows aggregation expressions | `{ $expr: { $gt: ["$price", "$discount"] } }` |
| **`$jsonSchema`** | Validate against JSON Schema | `{ $jsonSchema: { ... } }` |
| **`$mod`** | Modulo operation | `{ qty: { $mod: [4, 0] } }` |
| **`$regex`** | Regular expression match | `{ name: { $regex: /^J/i } }` |
| **`$text`** | Text search | `{ $text: { $search: "coffee" } }` |
| **`$where`** | JavaScript expression | `{ $where: "this.price > this.discount" }` |

### **Array Operators**

| Operator | Description | Example |
|----------|-------------|---------|
| **`$all`** | Array contains all elements | `{ tags: { $all: ["mongodb", "nodejs"] } }` |
| **`$elemMatch`** | Element matches all criteria | `{ scores: { $elemMatch: { $gt: 80, $lt: 90 } } }` |
| **`$size`** | Array size matches | `{ tags: { $size: 3 } }` |

### **Geospatial Operators**

| Operator | Description | Example |
|----------|-------------|---------|
| **`$geoWithin`** | Within geometry | `{ loc: { $geoWithin: { $geometry: {...} } } }` |
| **`$geoIntersects`** | Intersects geometry | `{ area: { $geoIntersects: {...} } }` |
| **`$near`** | Near point (with distance) | `{ loc: { $near: { $geometry: {...} } } }` |
| **`$nearSphere`** | Near point (spherical) | `{ loc: { $nearSphere: {...} } }` |

### **Bitwise Operators**

| Operator | Description | Example |
|----------|-------------|---------|
| **`$bitsAllSet`** | All bits set | `{ a: { $bitsAllSet: [1, 5] } }` |
| **`$bitsAnySet`** | Any bits set | `{ a: { $bitsAnySet: [1, 5] } }` |
| **`$bitsAllClear`** | All bits clear | `{ a: { $bitsAllClear: [1, 5] } }` |
| **`$bitsAnyClear`** | Any bits clear | `{ a: { $bitsAnyClear: [1, 5] } }` |

---

## **UPDATE OPERATORS**

### **Field Update Operators**

| Operator | Description | Example |
|----------|-------------|---------|
| **`$set`** | Set field value | `{ $set: { status: "active" } }` |
| **`$unset`** | Remove field | `{ $unset: { tempField: "" } }` |
| **`$setOnInsert`** | Set only on upsert insert | `{ $setOnInsert: { createdAt: new Date() } }` |
| **`$rename`** | Rename field | `{ $rename: { "oldName": "newName" } }` |
| **`$inc`** | Increment numeric field | `{ $inc: { views: 1 } }` |
| **`$min`** | Set if less than current | `{ $min: { bestScore: 90 } }` |
| **`$max`** | Set if greater than current | `{ $max: { highestBid: 500 } }` |
| **`$mul`** | Multiply numeric field | `{ $mul: { price: 1.1 } }` |
| **`$currentDate`** | Set to current date | `{ $currentDate: { lastModified: true } }` |

### **Array Update Operators**

| Operator | Description | Example |
|----------|-------------|---------|
| **`$push`** | Add to array | `{ $push: { tags: "new" } }` |
| **`$addToSet`** | Add unique to array | `{ $addToSet: { tags: "mongodb" } }` |
| **`$pop`** | Remove first/last | `{ $pop: { scores: 1 } }` (last) |
| **`$pull`** | Remove matching | `{ $pull: { tags: "old" } }` |
| **`$pullAll`** | Remove all matching | `{ $pullAll: { scores: [0, 5] } }` |
| **`$each`** | Modify multiple in array | `{ $push: { scores: { $each: [90, 92] } } }` |
| **`$position`** | Specify position in array | `{ $push: { items: { $each: ["x"], $position: 0 } } }` |
| **`$sort`** | Sort array elements | `{ $push: { scores: { $each: [], $sort: -1 } } }` |
| **`$slice`** | Limit array size | `{ $push: { scores: { $each: [95], $slice: -5 } } }` |

### **Array Update with Filters**

| Operator | Description | Example |
|----------|-------------|---------|
| **`$[<identifier>]`** | Filtered positional | `{ $set: { "grades.$[elem].score": 100 } }` |
| **`$[ ]`** | All array elements | `{ $inc: { "grades.$[].score": 10 } }` |
| **`$`** | First matching element | `{ $set: { "students.$.score": 95 } }` |

---

## **AGGREGATION PIPELINE OPERATORS**

### **Stage Operators**

| Operator | Description | Example |
|----------|-------------|---------|
| **`$match`** | Filter documents | `{ $match: { status: "A" } }` |
| **`$group`** | Group by expression | `{ $group: { _id: "$category", total: { $sum: "$amount" } } }` |
| **`$project`** | Reshape documents | `{ $project: { name: 1, total: 1 } }` |
| **`$sort`** | Sort documents | `{ $sort: { createdAt: -1 } }` |
| **`$limit`** | Limit documents | `{ $limit: 10 }` |
| **`$skip`** | Skip documents | `{ $skip: 5 }` |
| **`$unwind`** | Deconstruct array | `{ $unwind: "$tags" }` |
| **`$lookup`** | Join collections | `{ $lookup: { from: "orders", localField: "_id", foreignField: "userId", as: "orders" } }` |
| **`$facet`** | Multiple pipelines | `{ $facet: { categories: [...], prices: [...] } }` |
| **`$bucket`** | Group into buckets | `{ $bucket: { groupBy: "$price", boundaries: [0, 100, 200] } }` |
| **`$addFields`** | Add new fields | `{ $addFields: { total: { $add: ["$price", "$tax"] } } }` |
| **`$replaceRoot`** | Replace root document | `{ $replaceRoot: { newRoot: "$user" } }` |
| **`$merge`** | Merge results into collection | `{ $merge: { into: "reports" } }` |
| **`$out`** | Write to collection | `{ $out: "summary" }` |

### **Expression Operators (Aggregation)**

#### **Arithmetic Operators**
| Operator | Description | Example |
|----------|-------------|---------|
| **`$add`** | Add numbers/dates | `{ $add: ["$price", "$tax"] }` |
| **`$subtract`** | Subtract | `{ $subtract: ["$total", "$discount"] }` |
| **`$multiply`** | Multiply | `{ $multiply: ["$price", "$quantity"] }` |
| **`$divide`** | Divide | `{ $divide: ["$total", "$count"] }` |
| **`$mod`** | Modulo | `{ $mod: ["$hours", 24] }` |
| **`$abs`** | Absolute value | `{ $abs: "$difference" }` |
| **`$ceil`** | Ceiling | `{ $ceil: "$value" }` |
| **`$floor`** | Floor | `{ $floor: "$value" }` |
| **`$round`** | Round | `{ $round: ["$value", 2] }` |
| **`$sqrt`** | Square root | `{ $sqrt: "$value" }` |
| **`$pow`** | Power | `{ $pow: ["$value", 2] }` |
| **`$exp`** | Exponent | `{ $exp: "$value" }` |
| **`$ln`** | Natural log | `{ $ln: "$value" }` |
| **`$log10`** | Log base 10 | `{ $log10: "$value" }` |
| **`$log`** | Log with custom base | `{ $log: ["$value", 10] }` |
| **`$trunc`** | Truncate decimal | `{ $trunc: "$value" }` |

#### **String Operators**
| Operator | Description | Example |
|----------|-------------|---------|
| **`$concat`** | Concatenate strings | `{ $concat: ["$firstName", " ", "$lastName"] }` |
| **`$substr`** | Substring (deprecated) | `{ $substr: ["$name", 0, 3] }` |
| **`$substrBytes`** | Substring by bytes | `{ $substrBytes: ["$name", 0, 3] }` |
| **`$substrCP`** | Substring by code points | `{ $substrCP: ["$name", 0, 3] }` |
| **`$toLower`** | Lowercase | `{ $toLower: "$name" }` |
| **`$toUpper`** | Uppercase | `{ $toUpper: "$name" }` |
| **`$indexOfBytes`** | Find substring position | `{ $indexOfBytes: ["$text", "search"] }` |
| **`$indexOfCP`** | Find by code points | `{ $indexOfCP: ["$text", "search"] }` |
| **`$split`** | Split string to array | `{ $split: ["$tags", ","] }` |
| **`$strLenBytes`** | String length in bytes | `{ $strLenBytes: "$name" }` |
| **`$strLenCP`** | String length (code points) | `{ $strLenCP: "$name" }` |
| **`$trim`** | Trim whitespace | `{ $trim: { input: "$name" } }` |
| **`$ltrim`** | Left trim | `{ $ltrim: { input: "$name" } }` |
| **`$rtrim`** | Right trim | `{ $rtrim: { input: "$name" } }` |
| **`$regexMatch`** | Regex match | `{ $regexMatch: { input: "$text", regex: "pattern" } }` |
| **`$regexFind`** | Find regex match | `{ $regexFind: { input: "$text", regex: "pattern" } }` |
| **`$regexFindAll`** | Find all matches | `{ $regexFindAll: { input: "$text", regex: "pattern" } }` |

#### **Date Operators**
| Operator | Description | Example |
|----------|-------------|---------|
| **`$dateFromString`** | Convert string to date | `{ $dateFromString: { dateString: "$dateStr" } }` |
| **`$dateToString`** | Format date to string | `{ $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }` |
| **`$dayOfMonth`** | Day of month (1-31) | `{ $dayOfMonth: "$date" }` |
| **`$dayOfWeek`** | Day of week (1-7) | `{ $dayOfWeek: "$date" }` |
| **`$dayOfYear`** | Day of year (1-366) | `{ $dayOfYear: "$date" }` |
| **`$year`** | Year | `{ $year: "$date" }` |
| **`$month`** | Month (1-12) | `{ $month: "$date" }` |
| **`$week`** | Week of year (0-53) | `{ $week: "$date" }` |
| **`$hour`** | Hour (0-23) | `{ $hour: "$date" }` |
| **`$minute`** | Minute (0-59) | `{ $minute: "$date" }` |
| **`$second`** | Second (0-59) | `{ $second: "$date" }` |
| **`$millisecond`** | Millisecond (0-999) | `{ $millisecond: "$date" }` |
| **`$isoDayOfWeek`** | ISO day of week (1-7) | `{ $isoDayOfWeek: "$date" }` |
| **`$isoWeek`** | ISO week of year (1-53) | `{ $isoWeek: "$date" }` |
| **`$isoWeekYear`** | ISO week year | `{ $isoWeekYear: "$date" }` |

#### **Array Operators (Aggregation)**
| Operator | Description | Example |
|----------|-------------|---------|
| **`$arrayElemAt`** | Element at index | `{ $arrayElemAt: ["$array", 0] }` |
| **`$concatArrays`** | Concatenate arrays | `{ $concatArrays: ["$array1", "$array2"] }` |
| **`$filter`** | Filter array | `{ $filter: { input: "$scores", as: "score", cond: { $gt: ["$$score", 60] } } }` |
| **`$first`** | First array element | `{ $first: "$array" }` |
| **`$last`** | Last array element | `{ $last: "$array" }` |
| **`$in`** | Check if value in array | `{ $in: ["$value", "$array"] }` |
| **`$indexOfArray`** | Find index in array | `{ $indexOfArray: ["$array", "$value"] }` |
| **`$isArray`** | Check if array | `{ $isArray: "$field" }` |
| **`$map`** | Transform array | `{ $map: { input: "$prices", as: "price", in: { $multiply: ["$$price", 1.1] } } }` |
| **`$range`** | Create array range | `{ $range: [0, 10, 2] }` |
| **`$reduce`** | Reduce array | `{ $reduce: { input: "$values", initialValue: 0, in: { $add: ["$$value", "$$this"] } } }` |
| **`$reverseArray`** | Reverse array | `{ $reverseArray: "$array" }` |
| **`$size`** | Array size | `{ $size: "$array" }` |
| **`$slice`** | Array slice | `{ $slice: ["$array", 0, 5] }` |
| **`$zip`** | Merge arrays | `{ $zip: { inputs: ["$array1", "$array2"] } }` |

#### **Conditional Operators**
| Operator | Description | Example |
|----------|-------------|---------|
| **`$cond`** | If-then-else | `{ $cond: { if: { $gte: ["$score", 60] }, then: "Pass", else: "Fail" } }` |
| **`$ifNull`** | Return if not null | `{ $ifNull: ["$field", "Default"] }` |
| **`$switch`** | Switch case | `{ $switch: { branches: [...], default: "default" } }` |

#### **Type Conversion Operators**
| Operator | Description | Example |
|----------|-------------|---------|
| **`$convert`** | Convert data type | `{ $convert: { input: "$stringNumber", to: "int" } }` |
| **`$toBool`** | Convert to boolean | `{ $toBool: "$value" }` |
| **`$toDate`** | Convert to date | `{ $toDate: "$timestamp" }` |
| **`$toDecimal`** | Convert to decimal | `{ $toDecimal: "$stringNumber" }` |
| **`$toDouble`** | Convert to double | `{ $toDouble: "$stringNumber" }` |
| **`$toInt`** | Convert to integer | `{ $toInt: "$stringNumber" }` |
| **`$toLong`** | Convert to long | `{ $toLong: "$stringNumber" }` |
| **`$toObjectId`** | Convert to ObjectId | `{ $toObjectId: "$idString" }` |
| **`$toString`** | Convert to string | `{ $toString: "$number" }` |
| **`$type`** | Get BSON type | `{ $type: "$field" }` |

#### **Variable Operators**
| Operator | Description | Example |
|----------|-------------|---------|
| **`$let`** | Define variables | `{ $let: { vars: { total: { $add: ["$a", "$b"] } }, in: { $multiply: ["$$total", 2] } } }` |

#### **Literal/Text Operators**
| Operator | Description | Example |
|----------|-------------|---------|
| **`$literal`** | Return value without parsing | `{ $literal: "$dollarSign" }` |
| **`$mergeObjects`** | Merge objects | `{ $mergeObjects: ["$obj1", "$obj2"] }` |
| **`$objectToArray`** | Object to array of k-v pairs | `{ $objectToArray: "$obj" }` |
| **`$arrayToObject`** | Array to object | `{ $arrayToObject: "$array" }` |

---

## **QUERY MODIFIERS (Deprecated but good to know)**

| Operator | Description | Example |
|----------|-------------|---------|
| **`$comment`** | Add comment to query | `{ $comment: "Find active users" }` |
| **`$explain`** | Get query execution plan | `{ $explain: true }` |
| **`$hint`** | Force index usage | `{ $hint: { username: 1 } }` |
| **`$maxTimeMS`** | Max execution time | `{ $maxTimeMS: 5000 }` |
| **`$maxScan`** | Max documents to scan (deprecated) | `{ $maxScan: 1000 }` |
| **`$orderby`** | Sort results | `{ $orderby: { age: -1 } }` |
| **`$returnKey`** | Return index keys only | `{ $returnKey: true }` |
| **`$showDiskLoc`** | Show disk location | `{ $showDiskLoc: true }` |

---

## **INDEX OPERATORS**

| Operator | Description | Example |
|----------|-------------|---------|
| **`$text`** | Text index query | `{ $text: { $search: "mongodb" } }` |
| **`$natural`** | Natural order | `{ $natural: 1 }` |
| **`$2d`** | 2D geospatial index | `{ location: { $geoWithin: { $center: [[0,0], 10] } } }` |
| **`$2dsphere`** | 2D sphere index | `{ location: { $geoWithin: { $geometry: {...} } } }` |

---

## **KEY POINTS TO REMEMBER:**

1. **Query operators** are used in `find()`, `findOne()`, `count()`, etc.
2. **Update operators** are used in `updateOne()`, `updateMany()`, `findOneAndUpdate()`, etc.
3. **Aggregation operators** are used in `aggregate()` pipeline stages
4. Many operators work in multiple contexts (like `$in`, `$size`)
5. Always prefix operators with `$` sign
6. Some operators are deprecated in newer versions

## **COMMON REAL-WORLD EXAMPLES:**

```javascript
// Complex query combining multiple operators
db.users.find({
  $and: [
    { age: { $gte: 18, $lte: 65 } },
    { status: { $in: ["active", "pending"] } },
    { email: { $exists: true, $ne: null } },
    { $or: [
      { isPremium: true },
      { loginCount: { $gt: 100 } }
    ]}
  ]
});

// Aggregation with multiple operators
db.orders.aggregate([
  { $match: { status: "completed", date: { $gte: startDate } } },
  { $group: {
    _id: "$userId",
    totalSpent: { $sum: "$amount" },
    avgOrder: { $avg: "$amount" },
    firstOrder: { $min: "$date" },
    lastOrder: { $max: "$date" }
  }},
  { $sort: { totalSpent: -1 } },
  { $limit: 10 }
]);

// Update with array operators
db.products.updateOne(
  { _id: 123 },
  {
    $set: { lastUpdated: new Date() },
    $inc: { views: 1 },
    $push: { tags: { $each: ["new", "featured"], $position: 0 } },
    $addToSet: { categories: "electronics" }
  }
);
```

This list covers most MongoDB operators. Bookmark this for reference while building your application!