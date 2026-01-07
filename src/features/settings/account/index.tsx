import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'
import { PasswordForm } from './password-form'

/**
 * 账户设置页面
 *
 * 包含账户信息设置和密码修改功能
 *
 * @author ziye
 */
export function SettingsAccount() {
  return (
    <div className='space-y-10'>
      <ContentSection
        title='账户信息'
        desc='更新您的账户设置。设置您偏好的语言和时区。'
      >
        <AccountForm />
      </ContentSection>

      <ContentSection
        title='修改密码'
        desc='定期修改密码可以提高账户安全性。'
      >
        <PasswordForm />
      </ContentSection>
    </div>
  )
}
