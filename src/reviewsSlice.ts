import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Review {
  id: number;
  name: string;
  city: string;
  date: string;
  rating: number;
  category: string;
  title: string;
  text: string;
  avatar: string;
  stay: string;
  helpful: number;
  helpfulByMe: boolean;
}

export interface NewReview {
  name: string;
  city: string;
  rating: number;
  category: string;
  title: string;
  text: string;
}

const initialReviews: Review[] = [
  {
    id: 1,
    name: "ანა მელიქიძე",
    city: "თბილისი, საქართველო",
    date: "18 ივნისი, 2025",
    rating: 5,
    category: "სისუფთავე",
    title: "ადგილი, სადაც აუცილებლად დავბრუნდები",
    text: "ოთახი ზუსტად ისეთი დაგვხვდა, როგორიც ფოტოებზე იყო — ნათელი, სუფთა და ძალიან მყუდრო. პერსონალი განსაკუთრებულად ყურადღებიანია, საუზმე კი უბრალოდ შესანიშნავი. ძველ ქალაქამდე ფეხით რამდენიმე წუთში მიხვალ.",
    avatar: "photo-1534528741775-53994a69daeb",
    stay: "დარჩა 2 ღამე",
    helpful: 18,
    helpfulByMe: false,
  },
  {
    id: 2,
    name: "გიორგი ბერიძე",
    city: "ბათუმი, საქართველო",
    date: "12 ივნისი, 2025",
    rating: 5,
    category: "მომსახურება",
    title: "იდეალური არჩევანი პატარა დასვენებისთვის",
    text: "დაჯავშნა მარტივი იყო, მასპინძელი კი წინასწარ დაგვიკავშირდა და ყველა საჭირო ინფორმაცია მოგვაწოდა. აივნიდან ულამაზესი ხედი იშლება. აუცილებლად გირჩევთ წყვილებს.",
    avatar: "photo-1500648767791-00dcc994a43e",
    stay: "დარჩა 3 ღამე",
    helpful: 12,
    helpfulByMe: false,
  },
  {
    id: 3,
    name: "მარიამ ჯაფარიძე",
    city: "ქუთაისი, საქართველო",
    date: "5 ივნისი, 2025",
    rating: 4,
    category: "მდებარეობა",
    title: "მყუდრო, მშვიდი და ძალიან კომფორტული",
    text: "სასტუმრო მშვიდ ქუჩაზეა, მაგრამ რესტორნებთან და მუზეუმებთან ძალიან ახლოს. საწოლი კომფორტული იყო და ოთახშიც ყველაფერი დაგვხვდა, რაც გვჭირდებოდა. ერთადერთი, Wi-Fi ზოგჯერ ნელდებოდა.",
    avatar: "photo-1531123897727-8f129e1688ce",
    stay: "დარჩა 4 ღამე",
    helpful: 9,
    helpfulByMe: false,
  },
  {
    id: 4,
    name: "დავით კაპანაძე",
    city: "გორი, საქართველო",
    date: "29 მაისი, 2025",
    rating: 5,
    category: "კომფორტი",
    title: "მოლოდინს გადააჭარბა",
    text: "ძალიან კარგი გამოცდილება გვქონდა. ნომერი ფართო და მოვლილი დაგვხვდა, ჩექ-ინი კი რამდენიმე წუთში დასრულდა. განსაკუთრებით მომეწონა ადგილობრივი პროდუქტებით მომზადებული საუზმე.",
    avatar: "photo-1506794778202-cad84cf45f1d",
    stay: "დარჩა 1 ღამე",
    helpful: 7,
    helpfulByMe: false,
  },
  {
    id: 5,
    name: "სალომე ლომიძე",
    city: "თბილისი, საქართველო",
    date: "21 მაისი, 2025",
    rating: 4,
    category: "სისუფთავე",
    title: "თბილი გარემო და ყურადღებიანი გუნდი",
    text: "საღამოს გვიან მივედით, მაგრამ მიღებაზე ძალიან თბილად დაგვხვდნენ. ოთახი სუფთა იყო, საერთო სივრცე კი ლამაზი და მშვიდი. შემდეგ ვიზიტზეც სიამოვნებით ავირჩევ ამ ადგილს.",
    avatar: "photo-1524504388940-b1c1722653e1",
    stay: "დარჩა 2 ღამე",
    helpful: 6,
    helpfulByMe: false,
  },
  {
    id: 6,
    name: "ნიკა წერეთელი",
    city: "რუსთავი, საქართველო",
    date: "16 მაისი, 2025",
    rating: 5,
    category: "მომსახურება",
    title: "შესანიშნავი მომსახურება პირველივე წუთიდან",
    text: "პერსონალი დაგვეხმარა ქალაქში გადაადგილების დაგეგმვაშიც და ადგილობრივი კაფეებიც გვირჩია. ოთახი მშვიდი იყო, საერთო სივრცე კი საღამოს დასასვენებლად იდეალური.",
    avatar: "photo-1507003211169-0a1dd7228f2d",
    stay: "დარჩა 3 ღამე",
    helpful: 5,
    helpfulByMe: false,
  },
];

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: initialReviews,
  reducers: {
    addReview(state, action: PayloadAction<Review>) {
      state.unshift(action.payload);
    },
    toggleHelpful(state, action: PayloadAction<number>) {
      const review = state.find((item) => item.id === action.payload);
      if (!review) return;

      review.helpfulByMe = !review.helpfulByMe;
      review.helpful += review.helpfulByMe ? 1 : -1;
    },
  },
});

export const { addReview, toggleHelpful } = reviewsSlice.actions;
export default reviewsSlice.reducer;
