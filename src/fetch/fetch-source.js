import Vue from 'vue'
import { initMounte, done } from '@/utils/utils-common'
import { httpCreateNode } from '@/api/service'

export function fetchSource(props) {
    return new Promise(resolve => {
        const Component = Vue.extend({
            name: 'FecthSource',
            data() {
                return {
                    visible: false,
                    loading: true,
                    form: {
                        name: '绑定发送任务',
                        icon: 'https://oss.lisfes.cn/cloud/avatar/2021-09/1632984086053.png',
                        type: 'BIND_TASK',
                        connect: [],
                        delete: 1,
                        root: 1,
                        max: 1,
                        status: 1,
                        rules: []
                    },
                    rules: {
                        name: { required: true, message: '请输入节点名称', trigger: 'blur' },
                        icon: { required: true, message: '上传节点图标', trigger: 'blur' },
                        type: { required: true, message: '请选择节点类型', trigger: 'blur' },
                        max: { required: true, message: '请输入最大连接数', trigger: 'blur' }
                    },
                    column: [
                        { label: '绑定发送任务', value: 'BIND_TASK' },
                        { label: '自动营销', value: 'AUTO_MATIC' },
                        { label: '创建触发器', value: 'CREATE_TRIGGER' },
                        { label: '电子邮件', value: 'EMAIL' },
                        { label: '触发器', value: 'TRIGGER' },
                        { label: '目标', value: 'TARGET' }
                    ]
                }
            },
            mounted() {
                initMounte().finally(() => {
                    this.visible = true
                    const done = this.$watch('$route', () => this.onClose())
                    this.$once('hook:beforeDestroy', () => done())
                    this.fetchOneNode().finally(() => {
                        this.loading = false
                    })
                })
            },
            methods: {
                fetchOneNode() {
                    return new Promise(async resolve => {
                        resolve()
                    })
                },
                setRules(command, index) {
                    if (command === 'CREATE') {
                        this.form.rules.push({ max: 1, visible: 1, content: undefined })
                    } else {
                        this.form.rules.splice(index, 1)
                    }
                },
                onClose() {
                    this.visible = false
                    this.$emit('close', { done: delay => done(this.$el, delay ?? 500) })
                },
                onSubmit() {
                    this.$refs.formRef.validate(async valid => {
                        if (!valid) return false

                        try {
                            this.loading = true
                            const { data } = await httpCreateNode({ ...this.form })
                            console.log(data)
                            this.$message.success(data.message)
                            // this.$emit('submit', {
                            //     done: delay => {
                            //         this.visible = false
                            //         done(this.$el, delay ?? 500)
                            //     }
                            // })

                            this.loading = false
                        } catch (e) {
                            console.log(e)
                            this.loading = false
                        }
                    })
                }
            },
            render() {
                const { form, rules } = this

                return (
                    <el-dialog
                        top="10vh"
                        width="840px"
                        class="el-customize"
                        destroy-on-close
                        title={props?.title ?? '创建节点'}
                        visible={this.visible}
                        onClose={this.onClose}
                    >
                        <el-scrollbar class="el-customize">
                            <el-form
                                ref="formRef"
                                style={{ margin: '20px 20px 0' }}
                                {...{ props: { model: form, rules, labelPosition: 'right', labelWidth: '110px' } }}
                            >
                                <el-row gutter={20}>
                                    <el-col span={12}>
                                        <el-form-item label="节点名称" prop="name">
                                            <el-input v-model={form.name} placeholder="请输入节点名称"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col span={12}>
                                        <el-form-item label="节点图标" prop="icon">
                                            <el-input v-model={form.icon} placeholder="请上传节点图标"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col span={12}>
                                        <el-form-item label="节点类型" prop="type">
                                            <el-select
                                                v-model={form.type}
                                                placeholder="请选择节点类型"
                                                style={{ width: '100%' }}
                                            >
                                                {this.column.map(x => (
                                                    <el-option
                                                        key={x.value}
                                                        label={x.label}
                                                        value={x.value}
                                                    ></el-option>
                                                ))}
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col span={12}>
                                        <el-form-item label="节点连接类型">
                                            <el-select
                                                v-model={form.connect}
                                                multiple
                                                collapse-tags
                                                placeholder="请选择节点连接类型"
                                                style={{ width: '100%' }}
                                            >
                                                {this.column.map(x => (
                                                    <el-option
                                                        key={x.value}
                                                        label={x.label}
                                                        value={x.value}
                                                    ></el-option>
                                                ))}
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col span={12}>
                                        <el-form-item label="删除开关" required>
                                            <el-select
                                                v-model={form.delete}
                                                placeholder="删除开关"
                                                style={{ width: '100%' }}
                                            >
                                                <el-option label="开启" value={1}></el-option>
                                                <el-option label="关闭" value={0}></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col span={12}>
                                        <el-form-item label="节点层级" required>
                                            <el-select
                                                v-model={form.root}
                                                placeholder="节点层级"
                                                style={{ width: '100%' }}
                                            >
                                                <el-option label="顶层节点" value={1}></el-option>
                                                <el-option label="普通节点" value={0}></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col span={12}>
                                        <el-form-item label="最大连接数" prop="max">
                                            <el-input-number
                                                v-model={form.max}
                                                min={-1}
                                                step-strictly
                                                placeholder="请输入最大连接数"
                                                style={{ width: '100%' }}
                                            ></el-input-number>
                                        </el-form-item>
                                    </el-col>
                                    <el-col span={12}>
                                        <el-form-item label="节点状态" required>
                                            <el-select
                                                v-model={form.status}
                                                placeholder="请选择节点状态"
                                                style={{ width: '100%' }}
                                            >
                                                <el-option label="启用" value={1}></el-option>
                                                <el-option label="禁用" value={0}></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col span={24}>
                                        <el-form-item label="规则列表">
                                            {form.rules.map((x, index) => (
                                                <el-row
                                                    type="flex"
                                                    key={index}
                                                    gutter={16}
                                                    style={{ marginBottom: '22px' }}
                                                >
                                                    <el-col span={8}>
                                                        <el-form-item
                                                            prop={'rules.' + index + '.content'}
                                                            rules={{
                                                                required: true,
                                                                message: '请输入规则名称',
                                                                trigger: 'blur'
                                                            }}
                                                        >
                                                            <el-input
                                                                v-model={x.content}
                                                                placeholder="规则名称"
                                                            ></el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col span={8}>
                                                        <el-form-item
                                                            prop={'rules.' + index + '.max'}
                                                            rules={{
                                                                required: true,
                                                                message: '请输入最大分支',
                                                                trigger: 'blur'
                                                            }}
                                                        >
                                                            <el-input-number
                                                                v-model={x.max}
                                                                min={-1}
                                                                step-strictly
                                                                placeholder="最大分支"
                                                                style={{ width: '100%' }}
                                                            ></el-input-number>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col span={6}>
                                                        <el-form-item>
                                                            <el-select
                                                                v-model={x.visible}
                                                                placeholder="规则状态"
                                                                style={{ width: '100%' }}
                                                            >
                                                                <el-option label="显示" value={1}></el-option>
                                                                <el-option label="隐藏" value={0}></el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col span={2}>
                                                        <el-button
                                                            type="danger"
                                                            icon="el-icon-delete"
                                                            style={{ width: '40px', padding: '10px 0' }}
                                                            onClick={e => this.setRules('DELETE', index)}
                                                        ></el-button>
                                                    </el-col>
                                                </el-row>
                                            ))}
                                            <div
                                                class="el-upload el-upload--picture-card"
                                                style={{
                                                    width: '100%',
                                                    height: '50px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                onClick={e => this.setRules('CREATE')}
                                            >
                                                <i class="el-icon-plus avatar-uploader-icon"></i>
                                            </div>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </el-scrollbar>
                        <div slot="footer">
                            <el-button onClick={this.onClose}>取消</el-button>
                            <el-button type="primary" loading={this.loading} onClick={this.onSubmit}>
                                提交
                            </el-button>
                        </div>
                    </el-dialog>
                )
            }
        })

        const instance = new Component().$mount(document.createElement('div'))

        if (props?.container) {
            props.container?.appendChild?.(instance.$el)
        } else {
            document.body.appendChild(instance.$el)
        }

        resolve({ instance })
    })
}
