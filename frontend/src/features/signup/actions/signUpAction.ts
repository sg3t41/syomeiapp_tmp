'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import * as utils from '@/utils/index'
import { SignUpFormState } from '../types/SignUpFormState.type'

export async function signUpAction(
  _: SignUpFormState,
  formData: FormData,
): Promise<SignUpFormState> {
  // validation scheme
  const schema = z.object({
    username: z
      .string({
        invalid_type_error: 'ユーザー名が不正です。',
      })
      .max(20, { message: 'ユーザー名が長すぎます。' })
      .refine(value => value.trim() !== '', {
        message: 'ユーザー名を入力してください。',
        path: ['username'],
      }),
    email: z
      .string()
      .email({ message: 'Invalid email format' })
      .refine(value => value.trim() !== '', {
        message: 'メールアドレスを入力してください。',
        path: ['email'],
      }),
    password: z.string().refine(value => value.length >= 8, {
      message: 'パスワードは8文字以上で入力してください。',
      path: ['password'],
    }),
  })

  const validatedFields = schema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      username: '',
      email: '',
      password: '',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { username, email, password } = validatedFields.data
  try {
    console.log(username)
    console.log(email)
    console.log(password)

    revalidatePath('/')
    return {
      username,
      email,
      password: utils.sha256.hash(password),
    }
  } catch (e) {
    console.log(e)
    return {
      username: '',
      email: '',
      password: '',
      message: 'Failed to create todo',
    }
  }
}
