//////////////////////////////////////////////////////////////////////////////
// StarRating Component                                                      //
//////////////////////////////////////////////////////////////////////////////

interface IStarRatingProps {
  codeStars?: number;
  stepsStars?: number;
}

const CommentList = ({codeStars, stepsStars}: IStarRatingProps) => (
  <span>
    { codeStars >= 1 ? <span className="ratingOk">★</span> : <span className="ratingNone">☆</span> }
    { codeStars >= 2 ? <span className="ratingOk">★</span> : <span className="ratingNone">☆</span> }
    { codeStars >= 3 ? <span className="ratingOk">★</span> : <span className="ratingNone">☆</span> }
    { stepsStars >= 1 ? <span className="ratingOkLoc">★</span> : <span className="ratingNone">☆</span> }
    { stepsStars >= 2 ? <span className="ratingOkLoc">★</span> : <span className="ratingNone">☆</span> }
  </span>
);

export default CommentList;
