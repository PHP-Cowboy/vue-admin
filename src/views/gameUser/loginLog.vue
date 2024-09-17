<template>
    <div class="user-header">
        <el-form :inline="true" :model="formInline">
            <el-form-item>
                <el-input v-model.number="formInline.uid" maxlength="12" clearable placeholder="请输入用户ID"/>
            </el-form-item>
            <el-form-item>
                <el-form-item
                    label="渠道"
                    prop="channel_id"
                >
                    <el-select v-model="formInline.channel_id" clearable placeholder="请选择">
                        <el-option v-for="cl in channelList" :label="cl.channel_name" :value="cl.id"/>
                    </el-select>
                </el-form-item>
            </el-form-item>

            <el-form-item>
                <el-form-item
                    label="登录方式"
                    prop="login_mode"
                >
                    <el-select v-model="formInline.login_mode" clearable placeholder="请选择">
                        <el-option v-for="ml in modeList" :label="ml.label" :value="ml.value"/>
                    </el-select>
                </el-form-item>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" plain @click="handleSearch">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="table">
        <el-table :data="list" style="width: 100%">
            <el-table-column
                sortable
                v-for="item in tableLabel"
                :key="item.prop"
                :label="item.label"
                :prop="item.prop"
                :width="item.width ? item.width : 130"
            />
        </el-table>

        <el-pagination
            small
            background
            layout="prev, pager, next"
            :total="config.total"
            :page-size="config.size"
            @current-change="changePage"
            class="pager mt-4"
        />
    </div>
</template>


<script>
import {
    defineComponent,
    getCurrentInstance,
    onMounted,
    ref,
    reactive,
} from "vue";

export default defineComponent({
    setup() {
        const {proxy} = getCurrentInstance();
        const list = ref([]);
        const channelList = ref([])
        const tableLabel = reactive([
            {
                prop: "id",
                label: "ID",
            },
            {
                prop: "uid",
                label: "用户ID",
            },
            {
                prop: "nickname",
                label: "用户昵称",
            },
            {
                prop: "channel",
                label: "渠道",
            },
            {
                prop: "assets",
                label: "总资产",
            },
            {
                prop: "referral_commission",
                label: "推荐佣金",
            },
            {
                prop: "ip",
                label: "登录ip",
            },
            {
                prop: "device",
                label: "登录设备号",
                width:280,
            },
            {
                prop: "version",
                label: "登录版本号",
            },
            {
                prop: "login_mode",
                label: "登录方式",
            },
            {
                prop: "login_time",
                label: "登录时间",
            },
            {
                prop: "reg_time",
                label: "注册时间",
            },
        ]);
        const modeList = [
            {label: "游客", value: 1},
            {label: "手机号", value: 2},
        ];

        onMounted(() => {
            getLoginLogList(config);
            getChannelList();
        });
        const config = reactive({
            size:10,
            total:0,
        });
        const changePage = (page) => {
            config.page = page;
            getLoginLogList(config);
        };
        const getChannelList = async () => {
            let res = await proxy.$api.getChannelList();

            channelList.value = res.list;
        };
        const getLoginLogList = async (config) => {
            let res = await proxy.$api.getLoginLogList(config);

            list.value = res.list.map((item) => {
                switch (item.login_mode) {
                    case 1:
                        item.login_mode = "游客";
                        break
                    case 2:
                        item.login_mode = "手机号";
                        break
                    default:
                        item.login_mode = "其他";
                }
                return item;
            });

            config.total = res.total
        };
        const formInline = reactive({});
        const handleSearch = () => {
            config.uid = formInline.uid;
            config.login_mode = formInline.login_mode;
            config.channel_id = formInline.channel_id;
            getLoginLogList(config);
        };

        return {
            list,
            tableLabel,
            config,
            formInline,
            handleSearch,
            modeList,
            channelList,
            changePage,
        };
    },
});
</script>

<style lang="less" scoped>
.table {
    position: relative;
    height: 720px;

    .pager {
        position: absolute;
        right: 0;
        bottom: -20px;
    }
}

.user-header {
    display: flex;
    justify-content: space-between;
}
</style>
