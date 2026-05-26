/*
  Warnings:

  - The values [EXERCISES,MANAGE_EXERCISES] on the enum `GroupsRolesPermissions_permission` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `GroupsRolesPermissions` MODIFY `permission` ENUM('VMS', 'MODULES', 'MANAGE_VMS', 'MANAGE_MODULES', 'MANAGE_MEMBERS', 'MANAGE_CODES', 'MANAGE_ROLES', 'MANAGE_SETTINGS', 'ADMINISTRATOR') NOT NULL;
