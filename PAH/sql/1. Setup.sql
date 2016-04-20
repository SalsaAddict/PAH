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
		[Name] NVARCHAR(255) NOT NULL,
		[Gender] NCHAR(1) NULL,
		CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([Id]),
		CONSTRAINT [FK_User_Gender] FOREIGN KEY ([Gender]) REFERENCES [Gender] ([Gender])
	)
GO

INSERT INTO [User] ([Id], [Name], [Gender])
VALUES
	(706460439, N'Pierre Henry', N'M')
GO

CREATE TABLE [Genre] (
		[Id] TINYINT NOT NULL IDENTITY (1, 1),
		[Name] NVARCHAR(25) NOT NULL,
		CONSTRAINT [PK_Genre] PRIMARY KEY NONCLUSTERED ([Id]),
		CONSTRAINT [UQ_Genre_Name] UNIQUE CLUSTERED ([Name])
	)
GO

SET IDENTITY_INSERT [Genre] ON
INSERT INTO [Genre] ([Id], [Name])
VALUES
	(1, N'Salsa'),
	(2, N'Bachata'),
	(3, N'Kizomba'),
	(4, N'Cha-Cha')
SET IDENTITY_INSERT [Genre] OFF
GO

CREATE TABLE [Style] (
		[GenreId] TINYINT NOT NULL,
		[Id] SMALLINT NOT NULL IDENTITY (1, 1),
		[Name] NVARCHAR(25) NOT NULL,
		[Sort] TINYINT NOT NULL,
		CONSTRAINT [PK_Style] PRIMARY KEY NONCLUSTERED ([GenreId], [Id]),
		CONSTRAINT [UQ_Style_Id] UNIQUE ([Id]),
		CONSTRAINT [UQ_Style_Name] UNIQUE ([GenreId], [Name]),
		CONSTRAINT [UQ_Style_Sort] UNIQUE CLUSTERED ([GenreId], [Sort]),
		CONSTRAINT [FK_Style_Genre] FOREIGN KEY ([GenreId]) REFERENCES [Genre] ([Id])
	)
GO

INSERT INTO [Style] ([GenreId], [Name], [Sort])
VALUES
	(1, N'Cross-body On1', 1),
	(1, N'Cross-body On2', 2),
	(1, N'Casino (Cuban)', 3),
	(1, N'La Rueda', 4),
	(1, N'Son/Contratiempo', 5),
	(1, N'Cali/Colombian', 6),
	(2, N'Bachata (Traditional)', 1),
	(2, N'Bachata Moderna', 2),
	(2, N'Sensual Bachata', 3),
	(2, N'Bachatango', 4),
	(3, N'Kizomba (Traditional)', 1),
	(3, N'Urban Kiz', 2),
	(3, N'Tarraxinha', 3),
	(3, N'Semba', 4),
	(4, N'Cha-Cha', 1)
GO

CREATE TABLE [Tempo] (
		[Id] TINYINT NOT NULL IDENTITY (1, 1),
		[Description] NVARCHAR(25) NOT NULL,
		CONSTRAINT [PK_Tempo] PRIMARY KEY CLUSTERED ([Id]),
		CONSTRAINT [UQ_Tempo_Description] UNIQUE ([Description])
	)
GO

SET IDENTITY_INSERT [Tempo] ON
INSERT INTO [Tempo] ([Id], [Description])
VALUES
	(1, N'Slow'),
	(2, N'Medium'),
	(3, N'Fast')
SET IDENTITY_INSERT [Tempo] OFF
GO

CREATE TABLE [Song] (
		[Id] INT NOT NULL IDENTITY (1, 1),
		[YouTubeId] NVARCHAR(25) NOT NULL,
		[Title] NVARCHAR(255) NOT NULL,
		[Artist] NVARCHAR(255) NOT NULL,
		[GenreId] TINYINT NOT NULL,
		[TempoId] TINYINT NOT NULL,
		[DateSubmitted] DATETIMEOFFSET NOT NULL CONSTRAINT [DF_Song_DateSubmitted] DEFAULT (GETUTCDATE()),
		[UserId] BIGINT NOT NULL,
		CONSTRAINT [PK_Song] PRIMARY KEY CLUSTERED ([GenreId], [Id]),
		CONSTRAINT [UQ_Song_Id] UNIQUE ([Id]),
		CONSTRAINT [FK_Song_Genre] FOREIGN KEY ([GenreId]) REFERENCES [Genre] ([Id]),
		CONSTRAINT [FK_Song_Tempo] FOREIGN KEY ([TempoId]) REFERENCES [Tempo] ([Id]),
		CONSTRAINT [FK_Song_User] FOREIGN KEY ([UserId]) REFERENCES [User] ([Id])
	)
GO

CREATE TABLE [Review] (
		[SongId] INT NOT NULL,
		[GenreId] TINYINT NOT NULL,
		[StyleId] SMALLINT NOT NULL,
		[Recommend] BIT NOT NULL,
		[UserId] BIGINT NOT NULL,
		[DateReviewed] DATETIMEOFFSET NOT NULL CONSTRAINT [DF_Review_DateReviewed] DEFAULT (GETUTCDATE()),
		CONSTRAINT [PK_Review] PRIMARY KEY CLUSTERED ([SongId], [GenreId], [StyleId], [UserId]),
		CONSTRAINT [FK_Review_Song] FOREIGN KEY ([GenreId], [SongId]) REFERENCES [Song] ([GenreId], [Id]),
		CONSTRAINT [FK_Review_Style] FOREIGN KEY ([GenreId], [StyleId]) REFERENCES [Style] ([GenreId], [Id]),
		CONSTRAINT [FK_Review_User] FOREIGN KEY ([UserId]) REFERENCES [User] ([Id])
	)
GO

SET IDENTITY_INSERT [Song] ON
INSERT INTO [Song] ([Id], [YouTubeId], [Title], [Artist], [GenreId], [TempoId], [UserId])
VALUES
	(1, N'FRUBI2Lw5J4', N'Super Héroe', N'Tony Dize', 2, 2, 706460439)
SET IDENTITY_INSERT [Song] OFF
GO

INSERT INTO [Review] ([SongId], [GenreId], [StyleId], [Recommend], [UserId])