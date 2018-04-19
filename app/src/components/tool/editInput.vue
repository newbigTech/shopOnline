<!-- 
 * html: 编辑框
 * 实时反馈 html:编辑内容.
 * 此处不做任何处理
  -->
<template>
    <!--
        @focus="clickInput"
        @blur="blurInput"
        @focus="isLocked = true"
    -->
    <div class="edit-div"
        ref="editDiv"
        v-html="innerText"
        :contenteditable="canEdit"
        v-focus="focusState"
        @click="clickInput"
        @blur="isLocked = false"
        @input="changeInput"
    >
    </div>
</template>
<script>
export default {
    name: 'editDiv',
    props: {
        value: { type: String, default: ''},
        canEdit: { type: Boolean, default: true}
    },
    data() {
        return {
            isLocked: false,
            focusState: false,
            innerText: this.value
        }
    },
    watch: {
        value: function (val, oldVal) {
            if (val != oldVal && val.length) {
                this.$refs.editDiv.setAttribute('class', 'edit-div on');
            }
        }
    },
    // 注册一个自定义指令 `v-focus`
    directives: {
        focus: {
            // 指令的定义
            inserted: function(el) {
                el.focus();
            },
        }
    },
    methods: {
        clickInput(ev) {
            ev = ev || event;
            var el = ev.currentTarget;
            this.isLocked = true;
            if (this.innerText == this.value) {
                this.innerText = '';
            }
            el.focus();
        },
        changeInput() {
            this.$emit('input', this.$el.innerHTML);
        },
        blurInput() {
            this.isLocked = false;
            this.focusState = false;
        }
    }
}

</script>

<style scoped>
.edit-div.on { color: #333; }
.edit-div { padding: .5rem 1rem; border-radius: .5rem; overflow-y: auto; color: #b2b2b2; font-size: 1.2rem; line-height: 1.6rem; box-sizing: border-box;}
.edit-div:focus { border: 1px dotted #666; border: none; color: rgba(0,0,0,.7); outline: none; }
</style>