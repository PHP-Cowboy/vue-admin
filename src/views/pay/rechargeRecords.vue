<template>
    <div class="user-header">
        <el-button type="primary" plain @click="handleAdd">+新增</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item>
                <el-input v-model.number="formInline.uid" maxlength="12" clearable placeholder="请输入用户ID"/>
            </el-form-item>
            <el-form-item>
                <el-date-picker
                    v-model="formInline.ymd"
                    type="daterange"
                    range-separator="To"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    :size="size"
                />
            </el-form-item>
            <el-form-item>
                <el-input v-model.number="formInline.order_no" clearable maxlength="64" placeholder="请输入订单编号"/>
            </el-form-item>
            <el-form-item>
                <el-form-item
                    label="状态"
                    prop="status"
                >
                    <el-select v-model="formInline.status" clearable placeholder="请选择">
                        <el-option v-for="type in statusArr" :label="type.label" :value="type.value"/>
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
                prop: "ymd",
                label: "年月日",
            },
            {
                prop: "channel",
                label: "渠道",
            },
            {
                prop: "channel_no",
                label: "渠道编码",
            },
            {
                prop: "order_no",
                label: "订单编号",
            },
            {
                prop: "m_order_no",
                label: "三方订单号",
            },
            {
                prop: "account",
                label: "支付金额",
            },
            {
                prop: "cash",
                label: "cash",
            },
            {
                prop: "gift_cash",
                label: "赠送的cash",
            },
            {
                prop: "bonus",
                label: "bonus",
            },
            {
                prop: "name",
                label: "姓名",
                width:150,
            },
            {
                prop: "phone",
                label: "手机",
            },
            {
                prop: "status",
                label: "状态",
            },
            {
                prop: "complete_time",
                label: "订单完成时间",
            },
            {
                prop: "remark",
                label: "备注",
                width:250,
            },
            {
                prop: "type",
                label: "类型",
            },
            {
                prop: "created_at",
                label: "创建时间",
            },
            {
                prop: "updated_at",
                label: "更新时间",
            },
        ]);
        const statusArr = [
            {label: "等待支付", value: 0},
            {label: "完成支付", value: 1},
            {label: "下单失败", value: 2},
            {label: "已发货", value: 3},
        ];

        onMounted(() => {
            getRechargeRecords(config);
        });
        const config = reactive({
            name: "",
            size:10,
            total:0,
        });
        const changePage = (page) => {
            config.page = page;
            getRechargeRecords(config);
        };
        const getRechargeRecords = async (config) => {
            let res = await proxy.$api.getRechargeRecords(config);

            list.value = res.list.map((item) => {
                switch (item.status) {
                    case 0:
                        item.status = "等待支付";
                        break
                    case 1:
                        item.status = "完成支付";
                        break
                    case 2:
                        item.status = "下单失败";
                        break
                    case 3:
                        item.status = "已发货";
                        break
                }

                switch (item.type) {
                    case 1:
                        item.type = "充值";
                        break
                    case 2:
                        item.type = "礼包";
                        break
                }
                return item;
            });

            config.total = res.total
        };
        const formInline = reactive({});
        const handleSearch = () => {
            config.uid = formInline.uid;
            config.ymd = formInline.ymd;
            config.order_no = formInline.order_no;
            config.status = formInline.status;
            getRechargeRecords(config);
        };

        return {
            list,
            tableLabel,
            config,
            formInline,
            handleSearch,
            statusArr,
            changePage,
        };
    },
});
</script>

<style lang="less" scoped>
.table {
    position: relative;
    height: 760px;

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
