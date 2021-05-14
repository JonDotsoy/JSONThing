import { JSONThink, jsonThink } from ".";
import { descriptor } from "./descriptor";
import { TypeObject } from "./TypeObject";

describe("JSONthink", () => {
  it("sample", () => {
    class A {
      b = "b";

      toJSON() {
        return "a";
      }
    }

    expect(jsonThink.stringify({ a: new A() })).toEqual('{"a":"a"}');
  });

  it("Transform by Class", () => {
    class A {
      toJSONThink(): TypeObject<"A"> {
        return {
          $$type: "A",
        };
      }
      static fromJSONThink(value: TypeObject<"A">) {
        return new A();
      }
    }

    const jsonThink = new JSONThink();

    jsonThink.use(A);

    const stringify = jsonThink.stringify({
      myTitle: "myTitle",
      myA: new A(),
    });

    expect(stringify).toEqual('{"myTitle":"myTitle","myA":{"$$type":"A"}}');

    const parsed = jsonThink.parse(stringify);

    expect(parsed.myTitle).toStrictEqual("myTitle");
    expect(parsed.myA).toBeInstanceOf(A);
  });

  it("Transform by descriptions", () => {
    class GenericClass {
      constructor(private n = 0) {}
      addOne() {
        this.n += 1;
      }
      get value() {
        return this.n;
      }
    }

    const def: descriptor<"GenericClass", GenericClass> = {
      test: (val: any) => val instanceof GenericClass,
      toJSONThink(val) {
        return {
          $$type: "GenericClass",
          n: val.value,
        };
      },
      fromJSONThink(value) {
        return new GenericClass(value.n);
      },
    };

    const jsonThink = new JSONThink();
    jsonThink.use(def, "GenericClass");

    expect(JSON.stringify(new GenericClass())).toEqual(`{"n":0}`);
    const stringify = jsonThink.stringify(new GenericClass());
    expect(stringify).toEqual(`{"$$type":"GenericClass","n":0}`);
    const parse = jsonThink.parse(stringify);
    expect(parse).toBeInstanceOf(GenericClass);
  });

  it("Transform BigInt", () => {
    const stringify = jsonThink.stringify(123n);
    expect(stringify).toEqual(`{"$$type":"BigInt","value":"123"}`);
  });

  it("Transform Date", () => {
    expect(jsonThink.stringify(new Date(2021, 5, 1))).toEqual(
      `{"$$type":"Date","date":"2021-06-01T04:00:00.000Z"}`
    );
    expect(jsonThink.stringify({ d: new Date(2021, 5, 1) })).toEqual(
      `{"d":{"$$type":"Date","date":"2021-06-01T04:00:00.000Z"}}`
    );
  });

  it("Transform Buffer", () => {
    const stringify = jsonThink.stringify(Buffer.from("hola"));
    expect(stringify).toEqual(`{"$$type":"Buffer","data":[104,111,108,97]}`);
  });
});
