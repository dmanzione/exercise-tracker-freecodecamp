import java.util.*;
import java.io.*;
import java.lang.Math;
public class PaintersDilemma
{
    public static String paintersDilemma(int T, int[] N)
    {
        //this is default OUTPUT. You can change it.
        int result = -404;

        String answer = "";
        //write your Logic here:

        for(int i = 0;i<T;i++){
            int count = 0;
            int remainingShades = N[i];
            while(remainingShades>=8){
                count++;
                remainingShades-=8;
            }
            while(remainingShades>=5){
                count++;
                remainingShades-=5;
            }
            while(remainingShades>=2){
                count++;
                remainingShades-=2;
            }
            answer+=(count+"\n");


        }

        return answer;
    }

    public static void Main()
    {
        // INPUT [uncomment & modify if required]                                                                                                                                                                                                                                                                           
        int T = Convert.ToInt32(Console.ReadLine());

        int[] N = new int[T];
        int i;
        for (i = 0; i < T; i++)
        {
            N[i] = Convert.ToInt32(Console.ReadLine());
        }

        // OUTPUT [uncomment & modify if required]
        Console.WriteLine(paintersDilemma(T,N));
    }
}