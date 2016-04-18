USE [master]
GO

DECLARE @dbid INT
SET @dbid = DB_ID(N'MYDC')
IF @dbid IS NOT NULL BEGIN
	DECLARE @sql NVARCHAR(max)
	SELECT @sql = ISNULL(@sql + N';', N'') + N'KILL ' + CONVERT(NVARCHAR(10), [spid])
	FROM sys.sysprocesses
	WHERE [dbid] = @dbid
	EXEC (@SQL)
	DROP DATABASE [MYDC]
END
GO

CREATE DATABASE [MYDC]
GO

USE [MYDC]
GO

CREATE TABLE [Gender] (
		[Gender] NCHAR(1) NOT NULL,
		[Description] NVARCHAR(6) NOT NULL,
		CONSTRAINT [PK_Gender] PRIMARY KEY CLUSTERED ([Gender]),
		CONSTRAINT [UQ_Gender_Description] UNIQUE ([Description])
	)
GO

INSERT INTO [Gender] ([Gender], [Description])
VALUES
	(N'M', N'Male'),
	(N'F', N'Female')
GO

CREATE TABLE [User] (
		[Id] BIGINT NOT NULL,
		[Forename] NVARCHAR(127) NOT NULL,
		[Surname] NVARCHAR(127) NOT NULL,
		[Name] AS [Forename] + N' ' + [Surname] PERSISTED,
		[Gender] NCHAR(1) NULL,
		[Locale] NVARCHAR(5) NULL,
		[TZO] DECIMAL (4, 2) NULL,
		CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([Id]),
		CONSTRAINT [FK_User_Gender] FOREIGN KEY ([Gender]) REFERENCES [Gender] ([Gender]),
		CONSTRAINT [CK_User_Locale] CHECK ([Locale] LIKE N'[A-Z][A-Z]' OR [Locale] LIKE N'[A-Z][A-Z][-][A-Z][A-Z]'),
		CONSTRAINT [CK_User_TZO] CHECK ([TZO] BETWEEN -24 AND 24)
	)
GO