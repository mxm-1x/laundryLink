-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bagNumber" TEXT NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Laundry" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "clothCount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "dropDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pickupDate" TIMESTAMP(3),

    CONSTRAINT "Laundry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_bagNumber_key" ON "Student"("bagNumber");

-- AddForeignKey
ALTER TABLE "Laundry" ADD CONSTRAINT "Laundry_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
