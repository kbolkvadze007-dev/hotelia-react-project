import { useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, Outlet, Route, Routes, useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "./hooks";
import { addReview, toggleHelpful } from "./reviewsSlice";
import { ReviewCategoriesProvider, useReviewCategories } from "./ReviewCategoriesContext";

function createReview(values) {
  const name = values.author.trim();
  const text = values.comment.trim();

  return {
    id: Date.now(),
    name,
    city: "საქართველო",
    date: "ახლახან",
    stay: "ბოლო ვიზიტი",
    rating: Number(values.rating),
    category: values.category,
    title: text.length > 60 ? `${text.slice(0, 57)}...` : text,
    text,
    helpful: 0,
    helpfulByMe: false,
    avatar: "photo-1535713875002-d1d0cf377fde",
  };
}

function Stars({ value, small = false }) {
  return (
    <span className={`stars${small ? " stars-small" : ""}`} aria-label={`${value} 5-დან`}>
      {"★".repeat(value)}
      <span className="star-muted">{"★".repeat(5 - value)}</span>
    </span>
  );
}

function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="Roomi მთავარი გვერდი">
          <span className="brand-mark">r</span>
          <span>roomi</span>
        </Link>
        <nav className="main-nav" aria-label="მთავარი ნავიგაცია">
          <Link to="/reviews">განთავსებები</Link>
          <Link to="/reviews" className="nav-active">შეფასებები</Link>
          <Link to="/review">ჩვენ შესახებ</Link>
        </nav>
        <Link className="host-button" to="/review">
          <span className="host-plus">＋</span> შენი შეფასება
        </Link>
        <button className="mobile-menu" aria-label="მენიუ">☰</button>
      </div>
    </header>
  );
}

function RatingOverview({ reviews }) {
  const average = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <section className="rating-overview" aria-label="შეფასებების შეჯამება">
      <div className="score-panel">
        <div className="score-topline"><span className="score-badge">✳</span> სტუმრების შეფასებები</div>
        <div className="score-main">
          <strong>{average}</strong>
          <div><Stars value={Math.round(Number(average))} /><span className="score-caption">შესანიშნავი</span></div>
        </div>
        <p>რეალური შთაბეჭდილებები, ნამდვილი მოგზაურებისგან.</p>
      </div>
      <div className="rating-bars">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = reviews.filter((review) => review.rating === rating).length;
          const percentage = reviews.length ? (count / reviews.length) * 100 : 0;
          return (
            <div className="rating-row" key={rating}>
              <span>{rating}</span><span className="bar-star">★</span>
              <div className="bar-track"><span style={{ width: `${percentage}%` }} /></div>
              <span className="bar-count">{count}</span>
            </div>
          );
        })}
      </div>
      <div className="overview-divider" />
      <div className="review-total">
        <span className="total-icon">♡</span>
        <strong>{reviews.length}</strong>
        <span>დადასტურებული<br />შეფასება</span>
      </div>
      <div className="overview-note">
        <span className="verified-icon">✓</span>
        <span>ყველა შეფასება დაწერილია სტუმრების მიერ, რომლებმაც აქ ნამდვილად დაისვენეს.</span>
      </div>
    </section>
  );
}

function ReviewCard({ review, onHelpful }) {
  return (
    <article className="review-card">
      <div className="review-author">
        <img
          className="avatar"
          src={`https://images.unsplash.com/${review.avatar}?auto=format&fit=crop&w=112&h=112&q=80`}
          alt=""
          loading="lazy"
        />
        <div className="author-info">
          <strong>{review.name}</strong>
          <span>{review.city}</span>
        </div>
        <span className="verified-label"><span>✓</span> დადასტურებული</span>
      </div>
      <div className="review-meta">
        <Stars value={review.rating} small />
        <span className="meta-dot">·</span>
        <span>{review.date}</span>
        <span className="meta-dot">·</span>
        <span>{review.stay}</span>
      </div>
      <h3><Link className="review-title-link" to={`/reviews/${review.id}`}>{review.title}</Link></h3>
      <p className="review-text">{review.text}</p>
      <div className="review-footer">
        <span className="review-category">{review.category}</span>
        <button className="helpful-button" aria-label="გამომადგა" aria-pressed={review.helpfulByMe} onClick={() => onHelpful(review.id)}>
          {review.helpfulByMe ? "♥" : "♡"} <span>გამომადგა</span> <span className="helpful-count">{review.helpful}</span>
        </button>
      </div>
    </article>
  );
}

function ReviewForm({ onSubmit }) {
  const navigate = useNavigate();
  const categories = useReviewCategories();
  const formik = useFormik({
    initialValues: {
      author: "",
      rating: "",
      comment: "",
      email: "",
      category: "მომსახურება",
    },
    validationSchema: Yup.object({
      author: Yup.string().trim().required("გთხოვ, მიუთითე ავტორი."),
      rating: Yup.number()
        .transform((value, originalValue) => originalValue === "" ? undefined : value)
        .typeError("ქულა რიცხვი უნდა იყოს.")
        .min(1, "ქულა მინიმუმ 1 უნდა იყოს.")
        .max(5, "ქულა მაქსიმუმ 5 უნდა იყოს.")
        .required("აირჩიე ქულა."),
      comment: Yup.string()
        .trim()
        .min(10, "კომენტარი მინიმუმ 10 სიმბოლოს უნდა შეიცავდეს.")
        .required("გთხოვ, დატოვე კომენტარი."),
      email: Yup.string()
        .trim()
        .email("ელ-ფოსტის მისამართი არასწორია.")
        .required("გთხოვ, მიუთითე ელ-ფოსტა."),
      category: Yup.string().required(),
    }),
    onSubmit: (values) => {
      const review = onSubmit(values);
      navigate(`/reviews/${review.id}`);
    },
  });
  const showError = (field) => formik.touched[field] && formik.errors[field];

  return (
    <section className="form-section" id="write-review">
      <div className="form-intro">
        <span className="eyebrow">შენი ხმა მნიშვნელოვანია</span>
        <h2>გაუზიარე შენი<br /><span>შთაბეჭდილება</span></h2>
        <p>შენი გამოცდილება სხვებს დაეხმარება, რომ მოგზაურობა უფრო მარტივად დაგეგმონ.</p>
        <div className="form-trust"><span className="verified-icon">✓</span> გულწრფელი შეფასებები უკეთეს მოგზაურობას ქმნის</div>
        <div className="form-doodle" aria-hidden="true">✳</div>
      </div>
      <form className="review-form" noValidate onSubmit={formik.handleSubmit}>
            <div className="form-heading">
              <div><span className="form-step">01</span><div><h3>შენი შეფასება</h3><p>მოგვიყევი, როგორ ჩაიარა სტუმრობამ</p></div></div>
              <span className="required-note">* სავალდებულო ველი</span>
            </div>
            <div className="field-row">
              <label className="field"><span>ავტორი <span>*</span></span>
                <input name="author" value={formik.values.author} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="მაგ. ნინო მაისურაძე" autoComplete="name" />
                {showError("author") && <small className="field-error">{formik.errors.author}</small>}
              </label>
              <label className="field"><span>ელ-ფოსტა <span>*</span></span>
                <input type="email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="name@example.com" autoComplete="email" />
                {showError("email") && <small className="field-error">{formik.errors.email}</small>}
              </label>
            </div>
            <div className="field rating-field">
              <span>ქულა <span>*</span></span>
              <div className="rating-picker" role="radiogroup" aria-label="შეაფასე სტუმრობა">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    type="button"
                    className={rating <= Number(formik.values.rating) ? "rating-choice selected" : "rating-choice"}
                    key={rating}
                    role="radio"
                    aria-checked={Number(formik.values.rating) === rating}
                    aria-label={`${rating} ვარსკვლავი`}
                    onClick={() => {
                      formik.setFieldValue("rating", rating);
                      formik.setFieldTouched("rating", true, false);
                    }}
                  >★</button>
                ))}
                <span className="rating-hint">{formik.values.rating ? `${formik.values.rating} / 5` : "აირჩიე ვარსკვლავები"}</span>
              </div>
              {showError("rating") && <small className="field-error">{formik.errors.rating}</small>}
            </div>
            <label className="field"><span>კომენტარი <span>*</span></span>
              <textarea name="comment" rows="4" maxLength="500" value={formik.values.comment} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="რა მოგეწონა ყველაზე მეტად? რას ურჩევდი მომავალ სტუმრებს?" />
              <span className="textarea-foot">{showError("comment") ? <small className="field-error">{formik.errors.comment}</small> : <span>მინიმუმ 10 სიმბოლო</span>}<span>{formik.values.comment.length} / 500</span></span>
            </label>
            <label className="field">შეფასების თემა
              <select name="category" value={formik.values.category} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                {categories.slice(1).map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <button className="submit-button" type="submit" disabled={formik.isSubmitting}>შეფასების გამოქვეყნება <span>↗</span></button>
            <p className="form-privacy">გამოქვეყნებით ეთანხმები ჩვენს <a href="#write-review">შეფასების წესებს</a>.</p>
      </form>
    </section>
  );
}

function ReviewsPage() {
  const reviews = useAppSelector((state) => state.reviews);
  const dispatch = useAppDispatch();
  const categories = useReviewCategories();
  const onAddReview = (values) => {
    const review = createReview(values);
    dispatch(addReview(review));
    return review;
  };
  const onHelpful = (reviewId) => dispatch(toggleHelpful(reviewId));
  const [activeCategory, setActiveCategory] = useState("ყველა შეფასება");
  const [sort, setSort] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(4);
  const [query, setQuery] = useState("");

  const filteredReviews = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ka");
    const result = reviews.filter((review) => {
      const matchesCategory = activeCategory === "ყველა შეფასება" || review.category === activeCategory;
      const matchesQuery = !normalizedQuery || `${review.name} ${review.title} ${review.text} ${review.city}`.toLocaleLowerCase("ka").includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
    return [...result].sort((a, b) => sort === "highest" ? b.rating - a.rating : sort === "lowest" ? a.rating - b.rating : b.id - a.id);
  }, [reviews, activeCategory, query, sort]);

  return (
    <>
      <main>
        <div className="page-shell">
          <div className="breadcrumb"><Link to="/">მთავარი</Link><span>/</span><span>სტუმრების შეფასებები</span></div>
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow"><span className="eyebrow-line" /> ROOMI COMMUNITY</span>
              <h1>მოგზაურობა<br />სხვისი <em>თვალით.</em></h1>
              <p>აღმოაჩინე ადგილები, რომლებსაც სხვები გულით გვირჩევენ — ნამდვილი სტუმრების ნამდვილი ამბები.</p>
              <a className="hero-link" href="#reviews">შეფასებების ნახვა <span>↓</span></a>
            </div>
            <div className="hero-photo-wrap">
              <img className="hero-photo" src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1500&q=90" alt="მყუდრო და ნათელი სასტუმროს ნომერი" />
              <div className="photo-caption"><span className="caption-pin">⌖</span><span><strong>თბილისი, საქართველო</strong><small>ადგილი, რომელიც თავს სახლად გაგრძნობინებს</small></span></div>
              <div className="floating-rating"><span>★</span><strong>4.9</strong><small>სტუმრების რჩეული</small></div>
              <span className="photo-sparkle sparkle-one">✳</span>
            </div>
            <div className="hero-side-note">ნამდვილი ამბები. დაუვიწყარი მოგზაურობები.</div>
          </section>

          <RatingOverview reviews={reviews} />

          <section className="reviews-section" id="reviews">
            <div className="section-heading">
              <div><span className="eyebrow">მოგზაურებისგან, მოგზაურებისთვის</span><h2>რას ამბობენ <span>სტუმრები</span></h2></div>
              <span className="review-count">{reviews.length} შეფასება <span>↗</span></span>
            </div>
            <div className="review-toolbar">
              <div className="category-tabs" role="tablist" aria-label="შეფასებების ფილტრი">
                {categories.map((category) => (
                  <button key={category} role="tab" aria-selected={activeCategory === category} className={activeCategory === category ? "category-tab active" : "category-tab"} onClick={() => { setActiveCategory(category); setVisibleCount(4); }}>
                    {category}
                  </button>
                ))}
              </div>
              <div className="toolbar-actions">
                <label className="search-box"><span>⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(4); }} placeholder="ძიება" aria-label="შეფასებების ძიება" /></label>
                <label className="sort-box"><span>დალაგება:</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="შეფასებების დალაგება"><option value="newest">უახლესი</option><option value="highest">მაღალი შეფასება</option><option value="lowest">დაბალი შეფასება</option></select><span className="select-chevron">⌄</span></label>
              </div>
            </div>
            {filteredReviews.length ? (
              <div className="review-grid">
                {filteredReviews.slice(0, visibleCount).map((review) => <ReviewCard key={review.id} review={review} onHelpful={onHelpful} />)}
              </div>
            ) : (
              <div className="empty-state"><span>⌕</span><h3>შეფასება ვერ მოიძებნა</h3><p>სცადე სხვა სიტყვა ან აირჩიე სხვა კატეგორია.</p><button onClick={() => { setQuery(""); setActiveCategory("ყველა შეფასება"); }}>ფილტრების გასუფთავება</button></div>
            )}
            {filteredReviews.length > visibleCount && <button className="load-more" onClick={() => setVisibleCount((count) => count + 4)}>მეტი შეფასების ნახვა <span>↓</span></button>}
          </section>

          <ReviewForm onSubmit={onAddReview} />

          <section className="bottom-cta">
            <span className="cta-star">✳</span>
            <div><span className="eyebrow">შენი შემდეგი თავგადასავალი</span><h2>დარჩი სადმე <em>განსაკუთრებულში.</em></h2></div>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>აღმოაჩინე ადგილები <span>↗</span></button>
          </section>
        </div>
      </main>
    </>
  );
}

function ReviewFormPage() {
  const dispatch = useAppDispatch();
  const onAddReview = (values) => {
    const review = createReview(values);
    dispatch(addReview(review));
    return review;
  };

  return (
    <main>
      <div className="page-shell">
        <div className="breadcrumb"><Link to="/">მთავარი</Link><span>/</span><span>შეფასების დატოვება</span></div>
        <ReviewForm onSubmit={onAddReview} />
      </div>
    </main>
  );
}

function ReviewDetailPage() {
  const { reviewId } = useParams();
  const reviews = useAppSelector((state) => state.reviews);
  const dispatch = useAppDispatch();
  const onHelpful = (id) => dispatch(toggleHelpful(id));
  const review = reviews.find((item) => String(item.id) === reviewId);

  if (!review) {
    return (
      <main className="page-shell">
        <div className="breadcrumb"><Link to="/">მთავარი</Link><span>/</span><span>შეფასება ვერ მოიძებნა</span></div>
        <div className="empty-state">
          <span>⌕</span>
          <h3>ეს შეფასება ვერ მოიძებნა</h3>
          <p>შეფასება შესაძლოა წაშლილია ან მისამართი არასწორია.</p>
          <Link className="back-to-reviews" to="/reviews">ყველა შეფასების ნახვა</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div className="breadcrumb"><Link to="/">მთავარი</Link><span>/</span><Link to="/reviews">შეფასებები</Link><span>/</span><span>{review.name}</span></div>
      <section className="review-detail">
        <Link className="detail-back" to="/reviews">← ყველა შეფასება</Link>
        <span className="eyebrow">სტუმრის გამოცდილება</span>
        <div className="detail-title-row">
          <h1>{review.title}</h1>
          <Stars value={review.rating} />
        </div>
        <ReviewCard review={review} onHelpful={onHelpful} />
        <Link className="detail-write-link" to="/review">შენი შეფასების დატოვება <span>↗</span></Link>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <ReviewCategoriesProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<ReviewsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="review" element={<ReviewFormPage />} />
          <Route path="reviews/:reviewId" element={<ReviewDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ReviewCategoriesProvider>
  );
}

function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <footer className="site-footer"><Link className="brand footer-brand" to="/"><span className="brand-mark">r</span><span>roomi</span></Link><span>შექმნილია შენი უკეთესი მოგზაურობისთვის.</span><span>© 2025 Roomi</span></footer>
    </>
  );
}

function NotFoundPage() {
  return (
    <main className="page-shell">
      <div className="empty-state">
        <span>⌕</span>
        <h3>გვერდი ვერ მოიძებნა</h3>
        <p>შეამოწმე მისამართი ან დაბრუნდი შეფასებების გვერდზე.</p>
        <Link className="back-to-reviews" to="/reviews">შეფასებების ნახვა</Link>
      </div>
    </main>
  );
}
