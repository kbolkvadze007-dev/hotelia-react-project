# Hotelia — Hotel Booking Platform
სცენარი 3 · სტუდენტი 2

სასტუმროს ჯავშნების მართვის React SPA, მინიმალისტური და responsive დიზაინით.

## ფუნქციები
- React Single Page Application.
- React Router: `/bookings` და `/bookings/:bookingId`.
- `useParams` ჯავშნის დეტალების მისაღებად.
- Redux Toolkit: ჯავშნების სია, დამატება და გაუქმება.
- Redux Provider, `useSelector` და `useDispatch`.
- Formik ფორმა და Yup ვალიდაცია.
- სტუმრის სახელი — აუცილებელი ველი.
- სტუმრების რაოდენობა — მთელი რიცხვი, 1-დან 30-მდე.
- ვალიდური ელფოსტა.
- ოთახის ტიპი და შესვლის/გასვლის თარიღები.
- ძებნა, სტატუსით ფილტრაცია და ჯავშნის დეტალების გვერდი.
- Responsive განლაგება მობილურისა და კომპიუტერისთვის.

## გაშვება
საჭიროა Node.js-ის LTS ვერსია.

```bash
npm install
npm run dev
```

ტერმინალში ნაჩვენები `Local` მისამართი გახსენი ბრაუზერში.

## Build-ის შემოწმება
```bash
npm run build
```

## GitHub-ზე ატვირთვა
შექმენი ცარიელი GitHub repository და ტერმინალში გაუშვი:

```bash
git init
git add .
git commit -m "Complete Hotelia booking platform"
git branch -M student-2
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin student-2
```

`USERNAME/REPOSITORY` ჩაანაცვლე შენი რეალური GitHub მომხმარებლითა და repository-ის სახელით. თუ `origin` უკვე არსებობს, ხელახლა არ დაამატო — ჯერ შეამოწმე `git remote -v`.
