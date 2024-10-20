// SignUpFormの定義
import { signUpAction as formAction } from '../actions/signUpAction'
import type { SignUpFormState } from '../types/SignUpFormState.type'
import type { SignUpFormInputField } from '../types/SignUpFormInputField.type'
import * as Organism from '@/components/organisms'

const inputFields: Array<SignUpFormInputField> = [
  {
    label: 'ユーザー名',
    type: 'text',
    name: 'username',
    placeholder: 'ユーザー名を入力してください',
  },
  {
    label: 'メールアドレス',
    type: 'email',
    name: 'email',
    placeholder: 'メールアドレスを入力してください',
  },
  {
    label: 'パスワード',
    type: 'password',
    name: 'password',
    placeholder: 'パスワードを入力してください',
  },
]

const initialState: SignUpFormState = {
  username: '',
  email: '',
  password: '',
}

export const SignUpForm = () => {
  return (
    <Organism.Form<SignUpFormState, SignUpFormInputField>
      formAction={formAction}
      initialState={initialState}
      inputFields={inputFields}
    />
  )
}
