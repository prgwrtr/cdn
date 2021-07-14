<div id="single-media-designer">

  <ul id="nav-toc"
      class="nav nav-pills"
      role="tablist"
      style="margin:20px 0px">

    <li v-for="(tab, itab) in uiTabs"
        v-bind:class="(itab==0?'active':'')">
      <a v-bind:href="'#tab-' + tab.key"
         role="tab"
         data-toggle="tab">
        <!-- {{itab}}. {{tab.name}} -->
        {{tab.name}}
      </a>
    </li>
  </ul>

  <div class="tab-content">

    <div v-for="(tab, itab) in uiTabs"
         v-bind:id="'tab-' + tab.key"
         v-bind:class="'tab-pane' + (itab==0?' active':'')">

      <div v-for="f in tab.fields"
           class="input-group">

        <template v-if="f.uiType == 'select'">
          <label v-bind:for="f.key"
                 class="input-group-addon">
            {{f.name}}
          </label>
          <select v-bind:id="f.key"
                  v-model="values[f.varName]"
                  class="form-control"
                  v-on:change="onChangeDesigner"
                  v-on:input="onChangeDesigner">
            <option v-for="opt in f.options"
                    v-bind:value="opt.value">
              {{opt.name}}
            </option>
          </select>
        </template>

        <template v-else-if="f.uiType == 'textarea'">
          <label v-bind:for="f.key"
                 class="input-group-addon">
            {{f.name}}
          </label>
          <textarea v-bind:id="f.key"
                    v-model="values[f.varName]"
                    class="form-control"
                    v-bind:rows="f.rows"
                    v-bind:placeholder="f.placeholder"
                    v-on:change="onChangeDesigner"></textarea>
          <!-- do not monitor oninput -->
        </template>

        <template v-else-if="f.uiType === 'color'">
          <label v-bind:for="f.key"
                 class="input-group-addon">
            {{f.name}}
          </label>
          <input v-bind:id="f.key"
                 type="color"
                 v-model="values[f.varName]"
                 class="form-control"
                 v-on:change="onChangeDesigner"
                 v-on:input="onChangeDesigner">
        </template>

        <template v-else>
          <label v-bind:for="f.key"
                 class="input-group-addon">
            {{f.name}}
          </label>
          <input v-bind:id="f.key"
                 v-model="values[f.varName]"
                 class="form-control"
                 v-bind:placeholder="f.placeholder"
                 v-on:change="onChangeDesigner">
          <!-- do not monitor oninput -->
        </template>
      </div> <!-- .input-group -->

    </div> <!-- .tab-pane -->

  </div> <!-- .tab-content -->

  <div style="text-align:center">
    <button class="btn btn-lg btn-primary"
            type="button"
            v-on:click="onChangeDesigner">
      <span class="glyphicon glyphicon-refresh"></span>
      生成
    </button>
  </div>
</div> <!-- #single-media-designer -->


<script>
AppGV.vmSingleMediaDesigner = new Vue({
  el: '#single-media-designer',

  data: {
    values: Spgen.getValues(),
  },

  computed: {
    uiTabs: function() {
      var tabs = Spgen.uiTabs;
      //console.log("init tabs", tabs);
      return tabs;
    },

    previewer: function() {
      return AppGV.vmSingleMediaPreviewer;
    },

    codeWriter: function() {
      return AppGV.vmSingleMediaCodeWriter;
    },
  },

  methods: {
    refresh: function() {
      /*
      */
      this.codeWriter.update();
      this.previewer.update();
    },

    onChangeDesigner: function(evt) {
      if (evt.target.tagName === "INPUT") {
        console.log("changed", evt.target, evt.target.value);
      }
      this.refresh();
    },
  },

  mounted: function() {
    console.log("designer has been mounted", this.values);
  },

});
</script>
