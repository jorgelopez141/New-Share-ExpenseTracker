public class Main {

    public static void main(String[] args) {
	   double numPounds = 200d;
	   double convertedKilo = numPounds * 0.45;
	   System.out.println(convertedKilo);

	   //https://unicode.org/charts/PDF/U2600.pdf
	   char myChar = 'D';
	   char myUnicode = '\u2696'; //se le pone \\u para poner el codigo de unicode

	   System.out.println(myChar);
	   System.out.println(myUnicode);


    }
}