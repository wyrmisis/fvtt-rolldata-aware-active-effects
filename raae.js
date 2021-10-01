class RolldataAwareActiveEffect extends ActiveEffect {
    /**
     * Before passing changes to the parent ActiveEffect class,
     * we want to make some modifications to make the effect
     * rolldata aware.
     * 
     * @param {Actor} owner  The Actor that is affected by the effect
     * @param {Object} change  The changeset to be applied with the Effect
     * 
     * @override
     * 
     * @returns 
     */
    apply (owner, change) {
      const stringDiceFormat = /\d+d\d+/;
      
      // If the user wants to use the rolldata format
      // for grabbing data keys, why stop them?
      if (change.key.indexOf('@') === 0)
        change.key= change.key.replace('@', 'data.');
  
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
  
      return super.apply(owner, change);
    }
  }
  
  Hooks.once('init', async function() {
    console.info('Rolldata Aware Active Effects | Overriding default ActiveEffect class...')
    CONFIG.ActiveEffect.documentClass = RolldataAwareActiveEffect;
  });
  