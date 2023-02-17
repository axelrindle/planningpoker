# Database

All variable data is stored within a SQLite database. The data structures are set up using
simple migrations. A migration is a plain SQL file which is executed against the SQLite database.

Migrations reside within the `backend`'s `resources/database` directory.

During application startup, the files are scanned and sorted in natural order by their filename.
To keep track of already run migrations, a table is created in the database with the following structure:

| Attribute | Type | Example | Description |
| --- | --- | --- | --- |
| id | integer | 1 | An auto-incrementing unique identifier. |
| name | text | 00-init | Denotes the filename of a run migration. |
| execution | numeric | 1676402780230 | A unix timestamp indicating when this migration has been run. |

An entry in the table means a migration has been executed successfully in the past.
Already run migrations are skipped during startup.

Because the application is fairly simple in it's current state, there is no need for complex migration
systems with auto-rollback capabilities. One might be implemented in the future.
