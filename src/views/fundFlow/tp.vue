<template>
    <div class="user-header">
        <el-form :inline="true" :model="formInline">
            <el-form-item>
                <el-input v-model.number="formInline.uid" maxlength="12" clearable placeholder="请输入用户ID"/>
            </el-form-item>

            <el-form-item label="日期查询">
                <el-date-picker
                    v-model="formInline.created_at"
                    type="daterange"
                    range-separator="To"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    :size="size"
                />
            </el-form-item>

            <el-form-item>
                <el-form-item
                    label="金币来源"
                    prop="game_id"
                >
                    <el-select v-model="formInline.game_id" clearable placeholder="请选择">
                        <el-option v-for="gl in gameList" :label="gl.en_name" :value="gl.id"/>
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
                v-for="item in tableLabel"
                :key="item.prop"
                :label="item.label"
                :prop="item.prop"
                :width="item.width ? item.width : 160"
            />
            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <el-button size="small" @click="detail(scope.row)">详情</el-button>
                </template>
            </el-table-column>
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

    <el-dialog
        v-model="dialogVisible"
        title="详情"
        width="35%"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formFlow" ref="flowForm">

            <textarea rows="20" cols="80" v-model="formFlow.detail" />

        </el-form>
    </el-dialog>

</template>


<script>
import {
    defineComponent,
    getCurrentInstance,
    onMounted,
    ref,
    reactive,
} from "vue";
import {string} from "mockjs/src/mock/random/basic.js";

export default defineComponent({
    setup() {
        const {proxy} = getCurrentInstance();
        const list = ref([]);
        const channels = ref([])
        const gameList = ref([])
        const tableLabel = reactive([
            {
                prop: "user_name",
                label: "用户昵称",
            },
            {
                prop: "uid",
                label: "用户ID",
            },
            {
                prop: "created_at",
                label: "变动时间",
            },
            {
                prop: "id",
                label: "流水号",
            },
            {
                prop: "game",
                label: "金币来源",
            },
            {
                prop: "desk_id",
                label: "桌子id",
            },
            {
                prop: "before_win_cash",
                label: "变化前winCash",
            },
            {
                prop: "win_cash",
                label: "win_cash",
            },
            {
                prop: "before_cash",
                label: "变化前cash",
            },
            {
                prop: "cash",
                label: "cash",
            },
            {
                prop: "before_bonus",
                label: "变化前bonus",
            },
            {
                prop: "bonus",
                label: "bonus",
            },

            {
                prop: "nums",
                label: "变动数额(分)",
            },
            {
                prop: "tax",
                label: "税收",
            },
            {
                prop: "balance",
                label: "账户余额",
            },
            {
                prop: "remark",
                label: "备注",
            },
        ]);
        const formFlow = reactive({})
        const dialogVisible = ref(false);

        onMounted(() => {
            getGameList()
            getFundsFlowTp(config);
        });
        const config = reactive({});

        const changePage = (page) => {
            config.page = page;
            getFundsFlowTp(config);
        };

        const handleSearch = () => {
            config.uid = formInline.uid;
            config.game_id = formInline.game_id;

            config.created_at = formInline.created_at;

            getFundsFlowTp(config);
        };

        const getFundsFlowTp = async (config) => {
            let res = await proxy.$api.getFundsFlowTp(config);

            list.value = res.list.map((item)=>{
                item.game= gameMap.value.get(item.game_id);
                return item
            })

            config.total = res.total
        };

        const gameMap = reactive(new Map())

        const getGameList = async() => {
            let res = await proxy.$api.getGameList(config)
            gameList.value = res

            let mp = new Map();

            res.map((item) => {
                mp.set(item.id,item.en_name)
            });

            gameMap.value = mp
        }

        const detail = (row) => {
            // 浅拷贝
            dialogVisible.value = true;
            proxy.$nextTick(() => {
                Object.assign(formFlow, row);
            });
        };

        const handleClose = (done) => {
            proxy.$refs.flowForm.resetFields();
            done();
        };

        const formInline = reactive({});

        return {
            dialogVisible,
            handleClose,
            list,
            channels,
            gameList,
            tableLabel,
            formFlow,
            config,
            formInline,
            changePage,
            handleSearch,
            detail,
        };
    },
});
</script>

<style lang="less" scoped>
.table {
    position: relative;
    height: 520px;

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
