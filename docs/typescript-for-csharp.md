# TypeScript objects for C# developers

TypeScript's syntax is familiar if you know C#, but its type system works
differently. TypeScript checks types while you develop; its types are erased
when JavaScript is generated. A type declaration therefore does not create a
runtime object or validate data received from an API.

## Classes

A C# class can hold data and behavior:

```csharp
public class Player
{
    public string Name { get; set; }
    public int Score { get; private set; }

    public Player(string name)
    {
        Name = name;
        Score = 0;
    }

    public void AddPoints(int points)
    {
        Score += points;
    }
}

var player = new Player("Mole");
player.AddPoints(10);
```

The TypeScript equivalent uses `class`, a constructor, and methods in much the
same way:

```typescript
class Player {
  public score = 0;

  constructor(public name: string) {}

  addPoints(points: number): void {
    this.score += points;
  }
}

const player = new Player("Mole");
player.addPoints(10);
```

TypeScript's `public` and `private` modifiers are checked by the compiler.
`readonly` prevents reassignment after initialization. For example, use
`public readonly id: string` for a value that should not be reassigned.

## Enums

C# enums assign names to a set of values:

```csharp
public enum Faction
{
    Marquise,
    Eyrie,
    WoodlandAlliance
}

Faction faction = Faction.Marquise;
```

TypeScript also has enums:

```typescript
enum Faction {
  Marquise,
  Eyrie,
  WoodlandAlliance,
}

const faction: Faction = Faction.Marquise;
```

By default, these enum members have numeric values starting at zero. If the
values are strings (for example, in JSON), give them explicit string values:

```typescript
enum Faction {
  Marquise = "Marquise",
  Eyrie = "Eyrie",
  WoodlandAlliance = "WoodlandAlliance",
}
```

For a fixed set of string values, a union of string literals is another common
TypeScript option:

```typescript
type Faction = "Marquise" | "Eyrie" | "WoodlandAlliance";

const faction: Faction = "Marquise";
```

Unlike a C# enum, this `type` is only a compile-time constraint; it does not
create a runtime enum object.

## Records and object-shaped data

C# records are often used to represent data:

```csharp
public record PlayerProfile(string Name, int Score);

var profile = new PlayerProfile("Mole", 10);
```

TypeScript has no exact equivalent to a C# record. An `interface` or `type`
describes the shape an object must have. Create the object with an object
literal:

```typescript
interface PlayerProfile {
  name: string;
  score: number;
}

const profile: PlayerProfile = { name: "Mole", score: 10 };
```

Or define the same shape with a type alias:

```typescript
type PlayerProfile = {
  name: string;
  score: number;
};

const profile: PlayerProfile = { name: "Mole", score: 10 };
```

Both `interface` and object-shaped `type` aliases are checked structurally:
an object is compatible when it has the required properties with compatible
types. They do not generate a class or constructor. TypeScript also does not
automatically provide the value equality or immutable `with` copies of a C#
record. To make fields non-reassignable through a particular type, mark them
`readonly`:

```typescript
interface PlayerProfile {
  readonly name: string;
  readonly score: number;
}
```

This is a compile-time restriction, not runtime freezing.

## Useful C# to TypeScript type translations

| C# | TypeScript |
| --- | --- |
| `string` | `string` |
| `int`, `double` | `number` |
| `bool` | `boolean` |
| `T[]` or `List<T>` | `T[]` or `Array<T>` |
| `Dictionary<string, T>` | `Record<string, T>` |
| Nullable `T?` | `T \| null` (or `T \| undefined`, depending on the API) |
| `void` | `void` |

Use the lowercase TypeScript type names, such as `string` and `number`. The
uppercase names (`String`, `Number`, and `Boolean`) refer to JavaScript wrapper
objects and are usually not what you want.

## Avoid `any`

`any` disables type checking for a value and lets it flow into other code
without checks. Prefer a specific type when you know the shape. If a value is
unknown until you inspect it, use `unknown` and narrow it with a type guard:

```typescript
function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred";
}
```

This project runs ESLint as part of `npm run build`. Explicit `any` types are
lint errors, so they fail the build as well. TypeScript's `noImplicitAny`
compiler option also reports many cases where a type would otherwise be
inferred as `any`.
