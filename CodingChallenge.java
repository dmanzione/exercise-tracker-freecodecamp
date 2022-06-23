import java.util.*;
import java.io.*;
import java.lang.Math;

    public class CodingChallenge{
        public static int lastGladiatorStrength(int N,int[] A){
            int[] arr = A;
            Arrays.sort(arr);
            if (arr[N-2] == 0) {
                return arr[N-1];
            }

            arr[N-1] = arr[N-1] - arr[N-2];
            arr[N-2] = 0;
            return lastGladiatorStrength(N, arr);
        }
//        public static int lastGladiatorStrength(int N,int[] A){
//            //this is default OUTPUT. You can change it.
//            int result = -404;
//
//            //write your Logic here:
//
//            Arrays.sort(A);
//
//            ArrayList<Integer> arr= new ArrayList<Integer>();
//            for(int i = A.length-1;i>=0;i--){
//                arr.add(A[i]);
//            }
//
//            System.out.println(arr);
//
//            while(arr.size()>1){
//                if(arr.get(0)==arr.get(1)){
//                    arr.remove(0);
//                    arr.remove(0);
//                    if(arr.size()==0){
//                        return 0;
//                    }
//                }else {
//                    int strengthLeft = arr.get(0) - arr.get(1);
//                    arr.remove(0);
//                    arr.set(0,strengthLeft);
//
//                }
//                System.out.println(arr);
//                Collections.sort(arr);
//                Collections.reverse(arr);
//
//            }
//
//            return arr.get(0);
//        }
//public static int lastGladiatorStrength(int N,int[] A){
//    //this is default OUTPUT. You can change it.
//    int result = 0;
//
//    //write your Logic here:
//    Arrays.sort(A);
//
//    while(true){
//        if(A[N -1] == 0 && A[N-2] == 0){
//            return 0;
//        } else if (A[N -1] > 0 && A[N-2] == 0){
//            return A[N-1];
//        }
//        int outcome = A[N-1] - A[N-2];
//        if(outcome > 0){
//            A[N-1] = outcome;
//            A[N-2] = 0;
//        } else if (outcome == 0){
//            A[N-1] = 0;
//            A[N-2] = 0;
//        } else {
//            A[N-2] = A[N-1] - A[N-2];
//            A[N-1] = 0;
//        }
//        Arrays.sort(A);
//    }
//
//
//    //return result;
//}
        public static void main (String[]args){
            Scanner sc = new Scanner(System.in);

            // INPUT [uncomment & modify if required]
            int N = sc.nextInt();
            int[] A = new int[N];
            for (int i = 0; i < N; i++){
                A[i] = sc.nextInt();
            }


            sc.close();

            System.out.print(lastGladiatorStrength(N,A));
        }

}
