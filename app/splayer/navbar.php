<nav class="navbar navbar-default"
     id="top-navbar">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button"
              class="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#navbar-menu-1">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">
        <span v-bind:class='"glyphicon " + AppGV.glyphicon'></span>
        {{AppGV.title}}
        <span class="version">v{{AppGV.version}}</span>
      </a>
    </div> <!-- .navbar-header -->

    <div class="collapse navbar-collapse" id="navbar-menu-1">
      <ul class="nav navbar-nav">
          <!-- menu items -->
          <li v-for="item in menu"
              v-bind:id="item.id"
              v-bind:class="item.className">
            <a v-bind:id="item.linkId"
               v-bind:class="item.linkClassName"
               v-bind:href="item.href"
               v-on:click="item.onclick"
               v-html="item.html">
            </a>
          </li>
          <!-- end of menu items -->
        </ul>

        <ul class="nav navbar-nav navbar-right">
          <!-- right menu items -->
          <li v-for="item in menuRight"
              v-bind:id="item.id"
              v-bind:class="item.className">
            <a v-bind:id="item.linkId"
               v-bind:class="item.linkClassName"
               v-bind:href="item.href"
               v-on:click="item.onclick"
               v-html="item.html">
            </a>
          </li>
          <!-- end of right menu items -->

        </ul>
    </div> <!-- .navbar-collapse -->

  </div> <!-- .container-fluid -->
</nav> <!-- .navbar -->

<style>
#top-navbar .navbar-brand {
  font-size: 100%;
}

#top-navbar .navbar-brand .version {
  font-size: 90%;
}

</style>

<script>
var navbar = new Vue({
  el: '#top-navbar',
  data: {
    AppGV: AppGV,
    menu: {},
    menuRight: {},
  },
});
</script>
