interface ChallengeDto {
  _id?: String
  generate_by_user_id?: String
  text?: String
  hobbies?: String
}

interface JoinChallengeDto {
  challenge_id?: String
  user_id?: String
  completed?: Boolean
}

export { ChallengeDto, JoinChallengeDto }