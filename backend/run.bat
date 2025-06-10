@echo off
echo Starting DreamHome Backend Application...
echo.
echo Make sure MySQL is running and the database 'dreamhome_db' exists.
echo.
mvn spring-boot:run
pause
