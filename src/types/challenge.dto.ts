interface ChallengeDto {
  _id?: String
  generate_by_user_id?: String
  text?: String
  time_to_complete_the_challenge?: Number
}

interface ChallengeInProgressDto {
  challenge_id?: String
  user_id?: String
  completed?: Boolean
}

export { ChallengeDto, ChallengeInProgressDto }