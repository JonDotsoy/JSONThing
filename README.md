# JSONThink

**Proposal**

Use a generic json to export and import object with multiples types.

**Sample json Format**

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

Now, we to be using `jsonthink.parse` to parse the file.

```ts
// $ node -r jsonthink/register

// This is only to read the input data
const jsonData = fs.readFileSync(jsonfile, "utf8");

jsonthink.parse(jsonData);
// Output:
// {
//   id: '586fedcc-a547-418d-8dff-93b54053655f',
//   date: 2021-05-14T16:41:28.090Z,
//   size: 912384592101238283288242n,
//   hashPass: <Buffer 31 32 33 34>
// }
```

### Native Transforms

- Buffer
- BigInt
- Date

### Custom Transformer

On jsonthink, you can use the `.use(Entity)` method.

```ts
class MyEntity {
  constructor(private name: string) {}
  toJSONThink() {
    return {
      $$type: "MyEntity",
      name: this.name,
    };
  }
  fromJSONThink(value: any) {
    return new MyEntity(value.name);
  }
}

jsonthink.use(MyEntity);

const data = { myEntityInstance: new MyEntity("Rocky") };

const output = jsonthink.stringify(data);
// output:
// {
//   "myEntityInstance": {
//     "$$type": "MyEntity",
//     "name": "Rocky"
//   }
// }

jsonthink.parse(output);
// {
//   myEntityInstance: MyEntity { name: 'Rocky' }
// }
```
