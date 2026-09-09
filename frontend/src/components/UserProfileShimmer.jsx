export default function UserProfileShimmer() {
  return (
    <div className="min-h-screen w-full bg-[#f1f3f5]">
      {/* ================= PROFILE HEADER ================= */}
      <div className="relative h-65 w-full bg-[#0d191d] px-7 pt-8">
        {/* Profile Title */}
        <div className="h-7 w-28 animate-pulse rounded-md bg-[#263442]" />

        {/* Description */}
        <div className="mt-3 h-4 w-48 animate-pulse rounded bg-[#263442]" />

        {/* Profile User */}
        <div className="absolute bottom-8 left-7 flex items-center gap-6">
          {/* Avatar */}
          <div className="h-25 w-25 shrink-0 animate-pulse rounded-full bg-[#263442]" />

          {/* User Details */}
          <div>
            {/* Name */}
            <div className="mb-4 h-6 w-36 animate-pulse rounded bg-[#263442]" />

            {/* Email */}
            <div className="mb-3 h-4 w-40 animate-pulse rounded bg-[#263442]" />

            {/* Phone */}
            <div className="mb-3 h-4 w-32 animate-pulse rounded bg-[#263442]" />

            {/* Age */}
            <div className="h-4 w-20 animate-pulse rounded bg-[#263442]" />
          </div>
        </div>

        {/* Edit Button */}
        <div className="absolute right-7 top-10 h-11 w-24 animate-pulse rounded-lg bg-[#263442]" />
      </div>

      {/* ================= CONTACT HEADER ================= */}
      <div className="flex h-26 w-full items-center justify-between border-b border-gray-300 bg-white px-7">
        <div>
          {/* My Contacts */}
          <div className="h-6 w-40 animate-pulse rounded-md bg-gray-200" />

          {/* Contacts Count */}
          <div className="mt-3 h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>

        {/* MineChat Button */}
        <div className="h-11 w-32 animate-pulse rounded-full bg-gray-200" />
      </div>

      {/* ================= CONTACT CARDS ================= */}
      <div className="w-full bg-[#f1f3f5] p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="flex h-30 w-full items-center gap-6 rounded-xl border border-gray-200 bg-white px-5 shadow-sm">
              {/* Avatar */}
              <div className="h-17 w-17 shrink-0 animate-pulse rounded-full bg-gray-200" />

              {/* User Details */}
              <div className="flex-1">
                {/* Name */}
                <div className="mb-4 h-5 w-32 animate-pulse rounded bg-gray-200" />

                {/* Email */}
                <div className="mb-3 h-4 w-40 animate-pulse rounded bg-gray-200" />

                {/* Phone */}
                <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
