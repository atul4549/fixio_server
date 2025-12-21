**`$set`** is a MongoDB **update operator** used to set the value of a field in a document. It's one of the most commonly used operators in MongoDB updates.

## Basic Syntax

```javascript
db.collection.updateOne(
  { filter },  // Which document to update
  { $set: { field: value } },  // What to set
  { options }
)
```

## Examples

### 1. **Simple Field Update**
```javascript
// Update a user's name
db.users.updateOne(
  { _id: ObjectId("123") },
  { $set: { name: "John Doe" } }
);
```

### 2. **Update Multiple Fields**
```javascript
// Update multiple fields at once
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { 
    name: "Jane Smith",
    age: 25,
    city: "New York"
  }}
);
```

### 3. **Add New Field to Existing Document**
This is what you'd use for schema updates:
```javascript
// Add verification fields to existing user
db.users.updateOne(
  { _id: ObjectId("123") },
  { $set: { 
    isVerified: false,
    verificationToken: "abc123"
  }}
);
```

### 4. **Update Nested Fields**
```javascript
// Update a field inside an object
db.users.updateOne(
  { _id: ObjectId("123") },
  { $set: { 
    "address.city": "Mumbai",
    "address.pincode": "400001"
  }}
);
```

### 5. **Update Array Elements**
```javascript
// Update specific element in array
db.users.updateOne(
  { _id: ObjectId("123"), "hobbies._id": 1 },
  { $set: { "hobbies.$.name": "Reading" } }
);
```

## How `$set` Differs from Normal Assignment

### **Without `$set`** (Wrong way):
```javascript
// This REPLACES the entire document!
db.users.updateOne(
  { _id: ObjectId("123") },
  { name: "New Name" }  // BAD! Removes all other fields!
);
```

### **With `$set`** (Correct way):
```javascript
// This only updates specified fields
db.users.updateOne(
  { _id: ObjectId("123") },
  { $set: { name: "New Name" } }  // GOOD! Keeps other fields
);
```

## Common Use Cases in Your Scenario

### **1. Schema Migration (Your Case)**
```javascript
// Add verification fields to all users
db.users.updateMany(
  { isVerified: { $exists: false } },
  { $set: { 
    isVerified: false,
    verifiedAt: null
  }}
);
```

### **2. Batch Update with Default Values**
```javascript
// Set default preferences for users without them
db.users.updateMany(
  { preferences: { $exists: false } },
  { $set: { 
    preferences: {
      theme: "light",
      notifications: true,
      language: "en"
    }
  }}
);
```

## Comparison with Other Update Operators

| Operator | Purpose | Example |
|----------|---------|---------|
| **`$set`** | Set field value | `{ $set: { status: "active" } }` |
| **`$unset`** | Remove field | `{ $unset: { temporaryField: "" } }` |
| **`$inc`** | Increment numeric field | `{ $inc: { loginCount: 1 } }` |
| **`$push`** | Add to array | `{ $push: { logins: new Date() } }` |
| **`$addToSet`** | Add unique to array | `{ $addToSet: { tags: "premium" } }` |

## Important Behavior Notes

### **1. Field Creation**
`$set` creates the field if it doesn't exist:
```javascript
// If 'phone' field doesn't exist, it will be created
{ $set: { phone: "9876543210" } }
```

### **2. Data Type Changes**
`$set` can change data types:
```javascript
// Changes age from number to string
{ $set: { age: "twenty-five" } }
```

### **3. Multiple Documents**
With `updateMany()`:
```javascript
// Update all unverified users
db.users.updateMany(
  { isVerified: false },
  { $set: { lastReminderSent: new Date() } }
);
```

## Real Migration Example for Your 1 Lakh Users

```javascript
// Migration script for adding verification
async function migrateVerificationFields() {
  // 1. Add fields with default values
  await db.users.updateMany(
    {
      // Find users without verification fields
      $or: [
        { isVerified: { $exists: false } },
        { verificationToken: { $exists: false } }
      ]
    },
    {
      $set: {
        isVerified: false,
        verificationToken: null,
        verificationTokenExpires: null,
        verifiedAt: null
      }
    }
  );
  
  console.log("Migration completed!");
}
```

## Performance Tips for Large Datasets

### **1. Use Indexes**
```javascript
// Create index before migration
db.users.createIndex({ isVerified: 1 });

// Then run update
db.users.updateMany(
  { isVerified: { $exists: false } },
  { $set: { isVerified: false } }
);
```

### **2. Batch Updates for Large Collections**
```javascript
async function batchUpdate(batchSize = 1000) {
  let skip = 0;
  let updatedCount = 0;
  
  while (true) {
    const users = await db.users.find({ 
      isVerified: { $exists: false } 
    })
    .skip(skip)
    .limit(batchSize)
    .toArray();
    
    if (users.length === 0) break;
    
    const ids = users.map(u => u._id);
    
    await db.users.updateMany(
      { _id: { $in: ids } },
      { $set: { isVerified: false } }
    );
    
    updatedCount += users.length;
    skip += batchSize;
    
    console.log(`Updated ${updatedCount} users...`);
  }
}
```

## Common Mistakes to Avoid

### ❌ **Wrong: Missing `$set`**
```javascript
db.users.updateOne(
  { _id: 123 },
  { name: "New Name" }  // This replaces entire document!
);
```

### ✅ **Correct: Using `$set`**
```javascript
db.users.updateOne(
  { _id: 123 },
  { $set: { name: "New Name" } }  // Only updates name field
);
```

## In Your Verification