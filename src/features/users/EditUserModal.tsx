import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUIStore } from "@/store/uiStore";
import { useUsers, useUpdateUser } from "@/hooks/useUsers";
import { useToast } from "@/hooks/useToast";
import { getInitials } from "@/lib/utils";
import type { User, UserRole, UserStatus } from "@/types/user";
import { Loader2, CheckCircle2 } from "lucide-react";

function getAvatarColor(name: string) {
  const colors = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-amber-600",
    "from-rose-500 to-pink-600",
    "from-indigo-500 to-blue-600",
  ];
  const idx =
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return colors[idx];
}

export function EditUserModal() {
  const { editingUserId, closeEditModal } = useUIStore((s) => ({
    editingUserId: s.editingUserId,
    closeEditModal: s.closeEditModal,
  }));

  const { data } = useUsers();
  const { mutate: updateUser, isPending, isSuccess, reset } = useUpdateUser();
  const { toast } = useToast();

  const user = data?.users.find((u: User) => u.id === editingUserId);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "" as UserRole,
    status: "" as UserStatus,
    department: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
      });
    }
  }, [user]);

  const handleSave = () => {
    if (!editingUserId) return;
    updateUser(
      { id: editingUserId, payload: form },
      {
        onSuccess: () => {
          toast({
            variant: "success",
            title: "User updated",
            description: `${form.name} has been saved successfully.`,
          });
          closeEditModal();
          // setTimeout(() => closeEditModal(), 500);
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Update failed",
            description: "Could not save changes. Please try again.",
          });
        },
      },
    );
  };

  useEffect(() => {
    if (!editingUserId) {
      // setForm({
      //   name: "",
      //   email: "",
      //   role: "" as UserRole,
      //   status: "" as UserStatus,
      //   department: "",
      // });
      reset();
    }
  }, [editingUserId]);

  if (!user) return null;

  const gradientClass = getAvatarColor(user.name);

  return (
    <Dialog
      open={!!editingUserId}
      onOpenChange={(open) => !open && closeEditModal()}
    >
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and permissions.
          </DialogDescription>
        </DialogHeader>

        {/* User avatar preview */}
        <div className="flex items-center gap-4 py-2">
          <Avatar className="h-14 w-14">
            <AvatarFallback
              className={`bg-gradient-to-br ${gradientClass} text-white text-sm font-display font-semibold`}
            >
              {getInitials(form.name || user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold font-display text-foreground">
              {form.name || user.name}
            </p>
            <p className="text-sm text-muted-foreground font-body">
              {form.email || user.email}
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={form.department}
                onChange={(e) =>
                  setForm((p) => ({ ...p, department: e.target.value }))
                }
                placeholder="Department"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="Email address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, role: v as UserRole }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, status: v as UserStatus }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={closeEditModal}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="min-w-[100px]"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" /> Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
