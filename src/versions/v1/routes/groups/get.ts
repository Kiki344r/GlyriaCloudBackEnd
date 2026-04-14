import {RouteConfig} from "@/versions/routesManager";
import {verifyToken} from "@/versions/v1/middleware/verifyToken";
import {prisma} from "@/config";

export default {
    method: "GET",
    path: "/groups/get",
    middlewares: [verifyToken],
    handler: async (req, res) => {
        try {

            const {email} = req.userData!
            const groupId = req.query?.groupId as string | undefined

            if (!email) return res.status(404).json({success: false, message: "Cet utilisateur n'existe pas !"})
            console.log(email, groupId)
            const user = await prisma.users.findUnique({
                where: {
                    email: email
                },
                select: {
                    groups: {
                        where: groupId ? { groupId } : undefined,
                        select: {
                            role: {
                              select: {
                                  UUID: true,
                                  name: true,
                                  permissions: {
                                    select: {
                                        permission: true
                                    }
                                  }
                              }
                            },
                            group: {
                                include: {
                                    roles: {
                                      select: {
                                          UUID: true,
                                          name: true,
                                          permissions: {
                                              select: {
                                                permission: true
                                              }
                                          },
                                          members: {
                                              select: {
                                                  user: {
                                                      select: {
                                                          UUID: true
                                                      }
                                                  }
                                              }
                                          }
                                      }
                                    },
                                    owner: {
                                        select: {
                                            UUID: true,
                                            firstName: true,
                                            lastName: true
                                        }
                                    },
                                    members: groupId ? {
                                        select: {
                                            user: {
                                                select: {
                                                    UUID: true,
                                                    firstName: true,
                                                    lastName: true
                                                }
                                            },
                                            role: {
                                                select: {
                                                    UUID: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    } : undefined
                                }
                            }
                        }
                    }
                }
            })

            if (!user) return res.status(404).json({ success: false, message: "Cet utilisateur n'existe pas !" })

            user.groups.forEach(g => {
                // @ts-ignore
                g.role.permissions = g.role.permissions.map(p => p.permission)
                g.group.roles.forEach(r => {
                    // @ts-ignore
                    r.permissions = r.permissions.map(p => p.permission)
                    // @ts-ignore
                    r.members = r.members.map(m => m.user.UUID)
                })
            })

            if (groupId) {
                if (!user.groups[0]) return res.status(404).json({ success: false, message: "Groupe introuvable ou accès refusé !" })

                return res.status(200).json({ success: true, data: user.groups[0] })
            }

            return res.status(200).json({ success: true, data: user.groups.map(g => g.group) })

        } catch (e) {
            console.log(e)
            res.status(500).json({success: false})
        }
    }
} as RouteConfig;