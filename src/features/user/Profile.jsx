import Button from "../../ui/Button";

function Profile() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 sm:py-16 md:py-20 space-y-8">
      {/* PAGE TITLE */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary">
          Profile
        </h1>

        <p className="text-sm sm:text-base text-muted">
          Manage your account information and personal details.
        </p>
      </div>

      {/* PROFILE HEADER */}
      <div className="bg-white border border-primary/10 shadow-sm p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* LEFT */}
          <div className="flex items-center gap-5">
            <div className="h-24 w-24 shrink-0">
              <img
                src="https://i.pravatar.cc/150"
                alt="Profile"
                className="h-full w-full rounded-full object-cover border border-primary/10"
              />
            </div>

            <div className="space-y-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-primary">
                  Gelana Techan
                </h2>

                <p className="text-sm sm:text-base text-muted">
                  Customer Account
                </p>
              </div>

              <Button variant="primary" size="sm" className="rounded-sm">
                Update Avatar
              </Button>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <Button variant="outline" size="sm" className="rounded-sm">
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* PERSONAL INFORMATION */}
      <div className="bg-white border border-primary/10 shadow-sm p-6 md:p-8 space-y-6">
        {/* TOP */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-semibold text-primary">
              Personal Information
            </h3>

            <p className="text-sm text-muted">
              Your basic personal account information.
            </p>
          </div>

          <Button variant="outline" size="sm" className="rounded-sm shrink-0">
            Edit
          </Button>
        </div>

        {/* INFO GRID */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-muted">First Name</p>
            <p className="text-base font-medium text-primary">Gelana</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted">Last Name</p>
            <p className="text-base font-medium text-primary">Techan</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted">Email Address</p>
            <p className="text-base font-medium text-primary">
              gelana@gmail.com
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted">Phone Number</p>
            <p className="text-base font-medium text-primary">
              +251 911 597 665
            </p>
          </div>
        </div>
      </div>

      {/* ADDRESS */}
      <div className="bg-white border border-primary/10 shadow-sm p-6 md:p-8 space-y-6">
        {/* TOP */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-semibold text-primary">
              Address Information
            </h3>

            <p className="text-sm text-muted">
              Your shipping and billing information.
            </p>
          </div>

          <Button variant="outline" size="sm" className="rounded-sm shrink-0">
            Edit
          </Button>
        </div>

        {/* INFO GRID */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-muted">Country</p>
            <p className="text-base font-medium text-primary">Ethiopia</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted">City / State</p>
            <p className="text-base font-medium text-primary">
              Fitche Province
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted">Postal Code</p>
            <p className="text-base font-medium text-primary">ET-9000</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted">Tax ID</p>
            <p className="text-base font-medium text-primary">2364763</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
