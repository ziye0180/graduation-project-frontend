# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是科研数据与文献管理系统的**前端项目**，基于 shadcn-admin 模板构建，采用现代化的 React 技术栈。

### 核心技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.x | UI 框架 |
| Vite | 7.x | 构建工具 |
| TypeScript | 5.9.x | 类型系统 |
| TanStack Router | 1.141.x | 文件系统路由 |
| TanStack Query | 5.x | 数据请求与缓存 |
| TanStack Table | 8.x | 无头表格组件 |
| Shadcn UI | - | UI 组件库（Radix UI + Tailwind） |
| Tailwind CSS | 4.x | 原子化 CSS |
| Zustand | 5.x | 状态管理 |
| React Hook Form + Zod | - | 表单与验证 |
| Recharts | 3.x | 图表库 |
| Axios | 1.x | HTTP 请求 |

---

## 常用命令

```bash
# 安装依赖（使用 pnpm）
pnpm install

# 启动开发服务器（端口 5173）
pnpm dev

# 构建生产版本
pnpm build

# 代码检查
pnpm lint

# 格式化代码
pnpm format

# 代码格式检查（不修改）
pnpm format:check
```

---

## 目录结构

```
src/
├── routes/                    # 基于文件系统的路由
│   ├── __root.tsx            # 根路由（DevTools、Toaster）
│   ├── _authenticated/       # 认证保护路由组
│   │   ├── index.tsx        # 仪表盘首页 (/)
│   │   ├── settings/        # 设置模块
│   │   ├── tasks/           # 任务管理
│   │   ├── users/           # 用户管理
│   │   └── ...
│   ├── (auth)/              # 认证路由组
│   │   ├── sign-in.tsx      # 登录页
│   │   ├── sign-up.tsx      # 注册页
│   │   └── ...
│   └── (errors)/            # 错误页面
│
├── features/                 # 业务功能模块
│   ├── auth/                # 认证模块
│   ├── dashboard/           # 仪表盘
│   ├── tasks/               # 任务管理
│   ├── users/               # 用户管理
│   └── settings/            # 设置
│
├── components/               # 可复用组件
│   ├── ui/                  # Shadcn 基础组件（30+）
│   ├── layout/              # 布局组件（Sidebar、Header）
│   ├── data-table/          # 表格工具组件
│   └── ...                  # 自定义组件
│
├── stores/                   # Zustand 状态存储
│   └── auth-store.ts        # 认证状态
│
├── hooks/                    # 自定义 Hooks
│   ├── use-table-url-state.ts   # URL 同步表格状态
│   ├── use-mobile.tsx           # 响应式检测
│   └── use-dialog-state.tsx     # 对话框状态
│
├── context/                  # React Context
│   ├── theme-provider.tsx   # 主题管理
│   ├── layout-provider.tsx  # 布局配置
│   └── ...
│
├── lib/                      # 工具函数
│   ├── utils.ts             # cn()、sleep() 等
│   ├── cookies.ts           # Cookie 操作
│   └── handle-server-error.ts
│
├── styles/                   # 样式文件
│   ├── index.css            # 全局样式
│   └── theme.css            # 主题 CSS 变量
│
├── main.tsx                  # 应用入口
└── routeTree.gen.ts         # 自动生成的路由树
```

---

## 路由系统（TanStack Router）

### 路由约定

- `__root.tsx` - 根路由
- `_authenticated/` - 需要认证的路由组（Layout boundary）
- `(auth)/` - 路由分组（URL 中不显示）
- `$param` - 动态路由参数
- `index.tsx` - 目录索引页

### 主要路由

| 路由 | 文件 | 说明 |
|------|------|------|
| `/` | `_authenticated/index.tsx` | 仪表盘首页 |
| `/sign-in` | `(auth)/sign-in.tsx` | 登录页 |
| `/sign-up` | `(auth)/sign-up.tsx` | 注册页 |
| `/users` | `_authenticated/users/` | 用户管理 |
| `/tasks` | `_authenticated/tasks/` | 任务管理 |
| `/settings/*` | `_authenticated/settings/` | 设置页面 |

### 添加新路由

1. 在 `src/routes/_authenticated/` 创建目录
2. 创建 `index.tsx` 或 `route.tsx`
3. 路由树自动生成（TanStack Router DevTools 可查看）

---

## 状态管理

### Zustand 认证存储

```typescript
// stores/auth-store.ts
interface AuthState {
  user: AuthUser | null
  accessToken: string
  setUser(user: AuthUser | null): void
  setAccessToken(token: string): void
  reset(): void
}

// 使用方式
const { user, accessToken, setUser } = useAuthStore()
```

### React Query 数据缓存

```typescript
// 缓存配置
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000,  // 10秒内认为数据新鲜
      refetchOnWindowFocus: false,
    },
  },
})

// 查询示例
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: () => axios.get('/api/users'),
})
```

---

## UI 组件使用

### Shadcn UI

Shadcn 组件位于 `src/components/ui/`，可直接 import：

```typescript
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
```

### 表单处理（React Hook Form + Zod）

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('请输入有效的邮箱'),
  password: z.string().min(6, '密码至少 6 位'),
})

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { email: '', password: '' },
})
```

### 表格组件（TanStack Table）

```typescript
// 定义列
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='邮箱' />
    ),
  },
]

// 使用 DataTable 组件
<DataTable columns={columns} data={users} />
```

---

## 主题系统

支持三种主题模式：`light` | `dark` | `system`

```typescript
import { useTheme } from '@/context/theme-provider'

const { theme, setTheme } = useTheme()
setTheme('dark')
```

CSS 变量定义在 `src/styles/theme.css`。

---

## 开发约定

### 文件命名

- 组件文件：`kebab-case.tsx`（如 `user-card.tsx`）
- 组件导出：`PascalCase`（如 `export function UserCard()`）
- 工具函数：`camelCase`

### 目录组织

```
features/xxx/
├── components/       # 模块内组件
├── data/            # 数据定义、schema
├── hooks/           # 模块专用 hooks
└── index.tsx        # 模块入口
```

### TSDoc 注释

```typescript
/**
 * 用户卡片组件。
 *
 * @param user - 用户数据对象
 * @returns 渲染的用户卡片
 *
 * @example
 * ```tsx
 * <UserCard user={userData} />
 * ```
 */
export function UserCard({ user }: { user: User }) {
  // ...
}
```

---

## API 请求配置

### 后端地址

开发环境后端地址：`http://localhost:20003`

### Axios 配置

```typescript
// 待配置：src/lib/axios.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:20003',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加 Token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### 命名规范

- HTTP 请求/响应：`snake_case`（后端自动转换）
- 前端代码：`camelCase`

---

## 待开发功能

### 期中答辩（3个用例）

1. **用户登录/注册** - 对接后端 JWT 认证 API
2. **文献管理** - 文献 CRUD、上传、检索
3. **科研项目管理** - 项目 CRUD、成员管理

### 需要新增的路由

```
src/routes/_authenticated/
├── literature/           # 文献管理
│   ├── index.tsx        # 文献列表
│   └── $id.tsx          # 文献详情
├── projects/            # 项目管理
│   ├── index.tsx        # 项目列表
│   └── $id.tsx          # 项目详情
└── datasets/            # 数据集管理（期末）
```

---

## 相关资源

- **项目根目录 CLAUDE.md**: `../CLAUDE.md`
- **后端项目 CLAUDE.md**: `../graduation-project-backend/CLAUDE.md`
- **Shadcn UI 文档**: https://ui.shadcn.com
- **TanStack Router**: https://tanstack.com/router
- **TanStack Query**: https://tanstack.com/query
