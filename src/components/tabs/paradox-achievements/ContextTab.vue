<script>


export default {
  name: "ContextTab",
   data() {
    return {
      ADNerf: 0.2,
      PDNerf: 0.2,
      IDNerf: 0.2,
      TDNerf: 0.2,
      IPNerf: 0.2,
      EPNerf: 0.2,
    };
  },
  methods: {
    update(){
      this.ADNerf = [0.2, AbsurdityUpgrade.ADNerf.isBought ? 0.01 : 0, QuasmaUpgrade.dimNerf.isBought ? 0.01 : 0].sum();
      this.PDNerf = [0.2, AbsurdityUpgrade.PDNerf.isBought ? 0.01 : 0, QuasmaUpgrade.dimNerf.isBought ? 0.01 : 0].sum();
      this.IDNerf = [0.2, AbsurdityUpgrade.IDNerf.isBought ? 0.01 : 0, QuasmaUpgrade.dimNerf.isBought ? 0.01 : 0].sum();
      this.TDNerf = [0.2, QuasmaUpgrade.dimNerf.isBought ? 0.01 : 0].sum();
      this.IPNerf = AbsurdityUpgrade.IPNerf.isBought ? 0.27 : 0.25;
      this.EPNerf = 0.25;

    }
  }
};
</script>

<template>
  <div class="l-achievements-tab">
    <div class="c-achievements-tab__header">
      <div>
        There is a {{ formatPow(ADNerf, 2, 2) }} Nerf to Antimatter Dimensions <br>
        Softcap at {{format('1e50')}} for All ADs <br>
        Softcap at {{format('1e200')}} for 1st AD <br>
        Softcap at {{format('e2e6')}} for 1st AD while in EC8 <br>
        Softcap at {{format('e5e6')}} for All ADs
      </div><br>
      <div>
        There is a {{ formatPow(PDNerf, 2, 2) }} Nerf to Prism Dimensions
      </div>
      <div>
        There is a {{ formatPow(IDNerf, 2, 2) }} Nerf to Infinity Dimensions
      </div>
      <div>
        There is a {{ formatPow(TDNerf, 2, 2) }} Nerf to Time Dimensions
      </div><br>
      <div>
        There is a {{ formatPow(0.2, 2, 2) }} Nerf to Tickspeed
      </div><br>
      <div>
        There is a {{ formatPow(IPNerf, 2, 2) }} Nerf to Infinity Points <br>
        Softcap at {{format('1e4000')}}
      </div>
      <div>
        There is a {{ formatPow(EPNerf, 2, 2) }} Nerf to Eternity Points
      </div>
    </div>
  </div>
</template>
