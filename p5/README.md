# p5/ — Windows 真机阶段资产

这个目录存放 **P5 需要、但不在 git 里的东西**。因为 `deepseek-harness/` 被 `.gitignore`
排除（每到新机器都要重新 clone），放在那里的工作成果会丢。

## heywork-probe.spec.ts

端到端探针：用官方真实的 `plugin-manager` fixture 验证 V1 核心假设——
heywork 通过 profile/bundle 挂载后，权限/能力/配置叠加顺序与原 UMA 等价。

**在 Mac 上写好但没跑成**（沙箱拦 pnpm install）。到 Windows 依赖就绪后：

```powershell
cd deepseek-harness
corepack pnpm install --frozen-lockfile
copy ..\p5\heywork-probe.spec.ts packages\boot\plugin-manager\tests\
corepack pnpm vitest run packages/boot/plugin-manager/tests/heywork-probe.spec.ts
```

注意：探针 import 了 dsh 内部 API（`dsh-app-boot` 的 `boot/composeEntries/initProfile/
loadProfileDirectory/readProfilePatches`、`cordis-plugin-loader` 的 `Group`）。
官方 rc 阶段 API 可能漂移——若因 API 变动失败，按 `PROBE-RESULT.md` §5 的 Plan B 处理，
不要改官方源码。

## 完整执行步骤

见仓库根目录 **[P5-CHECKLIST.md](../P5-CHECKLIST.md)**。
