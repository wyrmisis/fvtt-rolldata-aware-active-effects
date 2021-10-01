import {libWrapper} from './libWrapper-shim.js';

/**
 * Before passing changes to the parent ActiveEffect class,
 * we want to make some modifications to make the effect
 * rolldata aware.
 * 
 * @param {*} wrapped   The next call in the libWrapper chain
 * @param {Actor} owner     The Actor that is affected by the effect
 * @param {Object} change    The changeset to be applied with the Effect
 * @returns 
 */
const apply = (wrapped, owner, change) => {
  const stringDiceFormat = /\d+d\d+/;
    
  // If the user wants to use the rolldata format
  // for grabbing data keys, why stop them?
  // This is purely syntactic sugar, and for folks
  // who copy-paste values between the key and value
  // fields.
  if (change.key.indexOf('@') === 0)
    change.key = change.key.replace('@', '');

  // If the user entered a dice formula, I really doubt they're 
  // looking to add a random number between X and Y every time
  // the Effect is applied, so we treat dice formulas as normal
  // strings.
  // For anything else, we use Roll.replaceFormulaData to handle
  // fetching of data fields from the actor, as well as math
  // operations.  
  if (!change.value.match(stringDiceFormat))
    change.value = Roll.replaceFormulaData(change.value, owner.getRollData());

  // If it'll evaluate, we'll send the evaluated result along 
  // for the change.
  // Otherwise we just send along the exact string we were given. 
  try {
    change.value = Roll.safeEval(change.value).toString();
  } catch (e) { /* noop */ }

  return wrapped(owner, change);
}

Hooks.once('init', async function() {
  console.info(`AAAA`, libWrapper);

  libWrapper.register(
    'fvtt-rolldata-aware-active-effects',
    'ActiveEffect.prototype.apply',
    apply
  );
});
