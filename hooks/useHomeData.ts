// // Tarih parametresi alıyor

// // --- EKSİK OLAN KISIM BURASI ---
// export const useToggleLog = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (data: {
//       userAmelId: number;
//       amelId: number;
//       isCompleted: boolean;
//     }) => {
//       await toggleDeedLog(data.userAmelId, data.amelId, data.isCompleted);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["myDailyDeeds"],
//       });
//     },
//   });
// };
