import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export interface User {
  id: number;
  username: string;
}

export interface OrganizationalUnit {
  id: number;
  name: string;
}

export interface SecuredObjectType {
  id: number;
  code: string;
  label: string;
}

export interface PermissionType {
  id: number;
  name: string;
}

export interface UserPermission {
  id: number;
  user: number;
  org_unit: number;
  object_type: number;
  permission: number;
}

export function usePermissionsData() {
  const [users, setUsers] = useState<User[]>([]);
  const [units, setUnits] = useState<OrganizationalUnit[]>([]);
  const [objects, setObjects] = useState<SecuredObjectType[]>([]);
  const [permissions, setPermissions] = useState<PermissionType[]>([]);

  useEffect(() => {
    fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/users/`)
      .then((res) => res.json())
      .then(setUsers);

    fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/orgunits/`)
      .then((res) => res.json())
      .then(setUnits);

    fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/permissions/types/`)
      .then((res) => res.json())
      .then(setPermissions);

    fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/permissions/objects/`)
      .then((res) => res.json())
      .then(setObjects);
  }, []);

  return {
    users,
    units,
    objects,
    permissions,
  };
}
