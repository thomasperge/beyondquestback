interface ChallengeDto {
  _id?: string
  generate_by_user_id?: string
  text?: string
  hobbies?: string
  level?: string
  createdAt?: Date
  updatedAt?: Date
}

interface JoinChallengeDto {
  _id?: string
  challenge_id?: string
  user_id?: string
  completed?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export { ChallengeDto, JoinChallengeDto }