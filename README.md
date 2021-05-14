# JSONThink

**Proposal**

Use a generic json to export and import object with multiples types.

**Sample**

Look at this json file.

```json
{
  "id": "586fedcc-a547-418d-8dff-93b54053655f",
  "date": {
    "$$type": "Date",
    "date": "2021-05-14T16:41:28.090Z"
  },
  "size": {
    "$$type": "BigInt",
    "value": "912384592101238283288242"
  },
  "hashPass": {
    "$$type": "Buffer",
    "data": [49, 50, 51, 52]
  }
}
```

Now, we to be using `jsonThink.parse` to parse the file.

```ts
// $ node -r jsonThink/register

// This is only to read the input data
const jsonData = fs.readFileSync(jsonfile, "utf8");

jsonThink.parse(jsonData);
// Output:
// {
//   id: '586fedcc-a547-418d-8dff-93b54053655f',
//   date: 2021-05-14T16:41:28.090Z,
//   size: 912384592101238283288242n,
//   hashPass: <Buffer 31 32 33 34>
// }
```
