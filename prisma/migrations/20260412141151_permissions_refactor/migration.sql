/*
  Warnings:

  - The values [READ,WRITE,MANAGE_PROXIES,MANAGE_VMS,ADMIN] on the enum `DefaultRolePermission_permission` will be removed. If these variants are still used in the database, this will fail.
  - The values [READ,WRITE,MANAGE_PROXIES,MANAGE_VMS,ADMIN] on the enum `DefaultRolePermission_permission` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `DefaultRolePermission` MODIFY `permission` ENUM('EXERCICES', 'MANAGE_EXERCICES', 'MANAGE_MEMBERS', 'MANAGE_CODES', 'MANAGE_SETTINGS') NOT NULL;

-- AlterTable
ALTER TABLE `GroupPermission` MODIFY `permission` ENUM('EXERCICES', 'MANAGE_EXERCICES', 'MANAGE_MEMBERS', 'MANAGE_CODES', 'MANAGE_SETTINGS') NOT NULL;
