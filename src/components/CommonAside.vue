<template>
    <el-aside :width="$store.state.isCollapse ? '180px' : '64px'">
        <el-menu
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            :collapse="!$store.state.isCollapse"
            :collapse-transition="false"
        >
            <h3 v-show="$store.state.isCollapse">浙安互娱</h3>
            <h3 v-show="!$store.state.isCollapse">浙安</h3>
            <el-menu-item
                :index="item.path"
                v-for="item in noChildren()"
                :key="item.path"
                @click="clickMenu(item)"
            >
                <component class="icons" :is="item.icon"></component>
                <span>{{ item.label }}</span>
            </el-menu-item>
            <el-sub-menu
                :index="item.label"
                v-for="item in hasChildren()"
                :key="item.path"
            >
                <template #title>
                    <component class="icons" :is="item.icon"></component>
                    <span>{{ item.label }}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item
                        :index="subItem.path"
                        v-for="(subItem, subIndex) in item.children"
                        :key="subIndex"
                        @click="clickMenu(subItem)"
                    >
                        <component class="icons" :is="subItem.icon"></component>
                        <span>{{ subItem.label }}</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
        </el-menu>
    </el-aside>
</template>

<script>
import {useRouter} from "vue-router";
import {useStore} from "vuex";

export default {
    setup() {
        const store = useStore();
        const router = useRouter();
        const noChildren = () => {
            return asyncList.filter((item) => !item.children);
        };

        const hasChildren = () => {
            return asyncList.filter((item) => item.children);
        };

        const asyncList = store.state.menu;
        const clickMenu = (item) => {
            router.push({
                name: item.name,
            });
            // vuex 来管理
            store.commit("selectMenu", item);
        };
        return {
            noChildren,
            hasChildren,
            clickMenu,
        };
    },
};
</script>

<style lang="less" scoped>
.icons {
    width: 18px;
    height: 18px;
}

.el-menu {
    border-right: none;

    h3 {
        line-height: 48px;
        color: #fff;
        text-align: center;
    }
}
</style>