# Rolldata Aware Active Effects
*I couldn't think of a snappy name for this, so have some math instead.*

This system-agnostic module allows you to use an Actor's rolldata in your
Active Effects.


## The Specifics
This module is fairly simple -- it overrides Foundry's included `ActiveEffect`
class with one that makes an effort to read rolldata. In addition, it adds a 
bit of syntactic sugar to the Attribute Key field -- you can use `@` in front
of your Attribute Key field, and the symbol will be stripped off. This was done
to make copy-pasting values into the key field lass onerous.

So, given an Attribute Key of `@data.hp.max` and an Effect Value of `floor(@data.level / 2)`,
you can expect that the actor receiving the effect will have their max HP increased
by the value of `data.level`, rounded down.


## Installation
Paste the following into the field at the bottom of the module installation dialog in Foundry:

```
https://github.com/wyrmisis/fvtt-rolldata-aware-active-effects/releases/latest/download/module.json
```


## Caveats
* If your system or other modules directly modify or override the `ActiveEffect` class
  , then I wouldn't expect this to work as intended.
* If your value includes a dice roll (e.g. `1d4` or `ceil(1d6/#some.property)`),
  your value will be passed along as a string, rather than evaluated. This is
  because evaluation of a value with a dice roll in it will only roll the number
  when the Effect is appled.
* I haven't done performance testing on this to know if hundreds of evaluations
  will break anything, so be warned.
* This was an easy change, but the Foundry team must not have included this in
  the core application for a reason. Remember to back up your data (if possible)
  before using tools that affect your live data -- or even better, put this through
  its paces in a test environment first!


## Thanks
* This idea was lifted from the [Dungeon Slayers 4](https://git.f3l.de/dungeonslayers/ds4) system, specifically [this file](https://git.f3l.de/dungeonslayers/ds4/-/blob/master/src/module/active-effect.ts).
