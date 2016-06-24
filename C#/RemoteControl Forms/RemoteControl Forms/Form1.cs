using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Quobject.SocketIoClientDotNet.Client;
using Newtonsoft.Json.Linq;
using System.Diagnostics;
using System.Runtime.InteropServices;
using WindowsInput;
using WindowsInput.Native;
using System.Threading;

namespace RemoteControl_Forms
{
    public partial class Form1 : Form
    {
		//VOLUME
		[DllImport("user32.dll")]
		public static extern IntPtr SendMessageW(IntPtr hWnd, int Msg, IntPtr wParam, IntPtr lParam);
		private const int APPCOMMAND_VOLUME_MUTE = 0x80000;
        private const int APPCOMMAND_VOLUME_UP = 0xA0000;
        private const int APPCOMMAND_VOLUME_DOWN = 0x90500;
        private const int WM_APPCOMMAND = 0x319;
       
        //CLICK
        [DllImport("user32.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall)]
        public static extern void mouse_event(long dwFlags, long dx, long dy, long cButtons, long dwExtraInfo);
        private const int MOUSEEVENTF_MIDDLEDONW = 0x20;
        private const int MOUSEEVENTF_MIDDLEUP = 0x40;
        private const int MOUSEEVENTF_LEFTDOWN = 0x02;
        private const int MOUSEEVENTF_LEFTUP = 0x04;
        private const int MOUSEEVENTF_RIGHTDOWN = 0x08;
        private const int MOUSEEVENTF_RIGHTUP = 0x10;

        //KEYS
        [DllImport("user32.dll")]
        public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, uint dwExtraInfo);
        private const int KEYEVENTF_KEYUP = 0x0002;
        private const int KEYEVENTF_EXTENDEDKEY = 0x0001;

		public Form1()
        {
            InitializeComponent();
			/* VARIABLES */
            string url = "http://localhost:3000";
            var socket = IO.Socket(url);
            int sensibilityRation = 5;
            JObject DataJson;
            this.Cursor = new Cursor(Cursor.Current.Handle);
			var psi_s = new ProcessStartInfo("shutdown", "/s /t 0");
			var psi_r = new ProcessStartInfo("shutdown", "/r /t 0");
			psi_s.CreateNoWindow = true;
			psi_s.UseShellExecute = false;
			psi_r.CreateNoWindow = true;
			psi_r.UseShellExecute = false;

			socket.On(Socket.EVENT_CONNECT, () =>
            {
                Debug.WriteLine("Connected to " + url);
            });

			socket.On("mouseMove", (data) =>
			{
				DataJson = JObject.Parse(@data.ToString());

				Cursor.Position = new Point(Cursor.Position.X + (int)DataJson["xAx"] * 1 / sensibilityRation, Cursor.Position.Y + (int)DataJson["yAx"] * 1 / sensibilityRation);
			});

            socket.On("command", (data) =>
            {
                DataJson = JObject.Parse(@data.ToString());

                switch (DataJson["cmd"].ToString())
                {
                    case "shutdown":
						Process.Start(psi_s);
                        break;
                    case "restart":
						Process.Start(psi_r);
						break;
                    case "volup":
						SendMessageW(this.Handle, WM_APPCOMMAND, this.Handle, (IntPtr)APPCOMMAND_VOLUME_UP);
						break;
                    case "voldown":
						SendMessageW(this.Handle, WM_APPCOMMAND, this.Handle, (IntPtr)APPCOMMAND_VOLUME_DOWN);
						break;
                    case "mute":
						SendMessageW(this.Handle, WM_APPCOMMAND, this.Handle, (IntPtr)APPCOMMAND_VOLUME_MUTE);
						break;
                }
            });

			socket.On("mousePress", (data) =>
			{
				DataJson = JObject.Parse(@data.ToString());

				if (DataJson["pressed"].ToString() == "1")
				{
					switch (DataJson["key"].ToString())
					{
						case "mouseleft":
							mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0);
							break;
						case "mouseright":
							mouse_event(MOUSEEVENTF_RIGHTDOWN, 0, 0, 0, 0);
							break;
						case "mousemiddle":
							mouse_event(MOUSEEVENTF_MIDDLEDONW, 0, 0, 0, 0);
							break;
					}
				}
				else
				{
					switch (DataJson["key"].ToString())
					{
						case "mouseleft":
							mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
							break;
						case "mouseright":
							mouse_event(MOUSEEVENTF_RIGHTUP, 0, 0, 0, 0);
							break;
						case "mousemiddle":
							mouse_event(MOUSEEVENTF_MIDDLEUP, 0, 0, 0, 0);
							break;
					}
				}

			});

			socket.On("keyPress", (data) =>
			{
				DataJson = JObject.Parse(@data.ToString());

				var key = Convert.ToByte(DataJson["keyCode"].ToString(), 16);

				if(DataJson["pressed"].ToString() == "1")
					keybd_event(key, 0, KEYEVENTF_EXTENDEDKEY, 0);
				else
					keybd_event(key, 0, KEYEVENTF_KEYUP, 0);

				Debug.WriteLine("Am apasat pe " + DataJson["key"]);
			});
        }

        private void VolMute()
        {
            
        }

        private void VolUp()
        {
            
        }

        private void VolDown()
        {
            
        }
	}
}
