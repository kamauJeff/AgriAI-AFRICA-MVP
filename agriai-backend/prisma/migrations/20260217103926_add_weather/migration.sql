BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Farm] ADD [lat] FLOAT(53),
[lon] FLOAT(53);

-- CreateTable
CREATE TABLE [dbo].[WeatherAlert] (
    [id] NVARCHAR(1000) NOT NULL,
    [farmId] NVARCHAR(1000) NOT NULL,
    [condition] NVARCHAR(1000) NOT NULL,
    [threshold] FLOAT(53) NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [WeatherAlert_active_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [WeatherAlert_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [WeatherAlert_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[WeatherAlert] ADD CONSTRAINT [WeatherAlert_farmId_fkey] FOREIGN KEY ([farmId]) REFERENCES [dbo].[Farm]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
